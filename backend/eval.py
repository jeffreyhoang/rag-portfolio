import json
import sys
from datetime import datetime
from typing import Any

from datasets import Dataset
from loguru import logger
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,
    context_precision,
    context_recall,
    faithfulness,
)

from backend.services.embedder import Embedder
from backend.services.generator import Generator
from backend.services.reranker import Reranker
from backend.services.retriever import Retriever, VectorStore

from dotenv import load_dotenv
load_dotenv()


# ---------------------------------------------------------------------------
# Test dataset — 20 questions covering all 6 documents evenly (~3-4 per doc)
# ---------------------------------------------------------------------------

TEST_CASES: list[dict[str, str]] = [
    # bio.md
    {
        "question": "Where is Jeffrey currently based and what is he studying?",
        "ground_truth": (
            "Jeffrey is based in San Jose, California and is pursuing a Master of "
            "Science in Artificial Intelligence at San Jose State University."
        ),
    },
    {
        "question": "What kind of role is Jeffrey looking for?",
        "ground_truth": (
            "Jeffrey is looking for a role as a machine learning engineer or AI "
            "software engineer where he can contribute meaningfully from day one "
            "while continuing to grow."
        ),
    },
    {
        "question": "What does Jeffrey do outside of work?",
        "ground_truth": (
            "Outside of work Jeffrey boxes, plays basketball, and coaches youth "
            "athletes with the Silicon Valley Soldiers."
        ),
    },
    # contact.md
    {
        "question": "What is Jeffrey's email address?",
        "ground_truth": "Jeffrey's email address is hoangjeffrey04@gmail.com.",
    },
    {
        "question": "What is Jeffrey's GitHub profile?",
        "ground_truth": "Jeffrey's GitHub profile is github.com/jeffreyhoang.",
    },
    {
        "question": "Is Jeffrey open to relocation?",
        "ground_truth": (
            "Jeffrey is based in San Jose, California, prefers to stay in "
            "California, but is open to relocation for the right opportunity. "
            "He is also open to remote and hybrid arrangements."
        ),
    },
    # education.md
    {
        "question": "What was Jeffrey's GPA at Cal Poly Pomona?",
        "ground_truth": "Jeffrey graduated from Cal Poly Pomona with a GPA of 3.91 out of 4.0.",
    },
    {
        "question": "What academic honors did Jeffrey receive at Cal Poly Pomona?",
        "ground_truth": (
            "Jeffrey received Dean's List and President's List recognition every "
            "semester enrolled at Cal Poly Pomona."
        ),
    },
    {
        "question": "What graduate courses is Jeffrey taking at SJSU?",
        "ground_truth": (
            "Jeffrey's graduate coursework includes Machine Learning, Artificial "
            "Intelligence and Data Engineering, and Math Foundations for Decision "
            "and Data Sciences."
        ),
    },
    # experience_tech.md
    {
        "question": "Who supervised Jeffrey's research at the Computational Intelligence Lab?",
        "ground_truth": (
            "Jeffrey's research at the Computational Intelligence Lab was supervised "
            "by Dr. Hao Ji, Ph.D., Associate Professor at Cal Poly Pomona."
        ),
    },
    {
        "question": "What technologies did Jeffrey use in his research role at Cal Poly Pomona?",
        "ground_truth": (
            "Jeffrey used Python, TensorFlow, OpenGoPro API, NVIDIA A100 GPUs, HPC "
            "clusters, forward kinematics, MuJoCo, and the Human3.6M dataset."
        ),
    },
    {
        "question": "What did Jeffrey build for Project Sloka?",
        "ground_truth": (
            "Jeffrey led the full-stack design and development of an AI-powered "
            "adaptive learning platform for elementary school students using Next.js, "
            "Supabase, Tailwind CSS, and the Gemini GPT API."
        ),
    },
    # experience_other.md
    {
        "question": "What is the Silicon Valley Soldiers?",
        "ground_truth": (
            "The Silicon Valley Soldiers is a competitive youth basketball "
            "organization affiliated with the Nike EYBL Oakland Soldiers, based "
            "in San Jose. It was born from BMG Basketball Academy, founded in 2015, "
            "and merged with the Nike EYBL Oakland Soldiers in 2021."
        ),
    },
    {
        "question": "Where did Jeffrey work as a host and server trainee?",
        "ground_truth": "Jeffrey worked as a host and server trainee at Fitbites in Pomona, CA.",
    },
    {
        "question": "What age groups does Jeffrey coach at Silicon Valley Soldiers?",
        "ground_truth": "Jeffrey coaches athletes between the 10U and 14U age groups at Silicon Valley Soldiers.",
    },
    # projects.md
    {
        "question": "What models did Jeffrey implement for the ASL recognition system?",
        "ground_truth": (
            "Jeffrey implemented a BiLSTM and a Transformer architecture in PyTorch. "
            "The BiLSTM achieved 73.0% top-1 test accuracy and was selected as the "
            "production model. The Transformer achieved 69.9% accuracy."
        ),
    },
    {
        "question": "What tech stack powers the RAG Portfolio Assistant?",
        "ground_truth": (
            "The RAG Portfolio Assistant is built with Python, FastAPI, LangChain, "
            "ChromaDB, Pinecone, OpenAI API, sentence-transformers, rank-bm25, ragas, "
            "React, Tailwind CSS, and is deployed on Railway and Vercel."
        ),
    },
    {
        "question": "What dataset was used for the multimodal sentiment analysis project?",
        "ground_truth": (
            "The multimodal sentiment analysis project used the MVSA-Single dataset "
            "containing 2,592 cleaned Twitter image-text pairs labeled as positive, "
            "neutral, or negative."
        ),
    },
    {
        "question": "What does ResumeAI do and what is its tech stack?",
        "ground_truth": (
            "ResumeAI is a full-stack AI-powered resume builder that lets users input "
            "their information and get AI-powered recommendations with one-click PDF "
            "export. It uses React, Vite, Tailwind CSS, Python, Flask, OpenAI API, "
            "and WeasyPrint."
        ),
    },
    {
        "question": "What fusion architectures were evaluated in the multimodal sentiment analysis project?",
        "ground_truth": (
            "Four fusion architectures were evaluated: score-level fusion, "
            "embedding-level fusion, scalar-gated fusion, and vector-gated fusion. "
            "Score-level and vector-gated fusion both achieved the highest accuracy "
            "of 79.43%."
        ),
    },
]


def run_eval() -> Any:
    """Run all 20 test cases through the full RAG pipeline and return ragas results.

    Instantiates all services, runs each question through retrieve → rerank →
    generate, collects answers and contexts, then evaluates using ragas metrics:
    faithfulness, answer_relevancy, context_precision, and context_recall.
    """
    embedder = Embedder()
    store = VectorStore()
    retriever = Retriever(vector_store=store, embedder=embedder)
    reranker = Reranker()
    generator = Generator()

    results: list[dict[str, Any]] = []

    for i, case in enumerate(TEST_CASES, start=1):
        question = case["question"]
        ground_truth = case["ground_truth"]
        logger.info(f"[{i}/{len(TEST_CASES)}] Evaluating: {question!r}")

        retrieved_chunks = retriever.retrieve(question)
        contexts = [c["text"] for c in retrieved_chunks]

        reranked_chunks = reranker.rerank(question, retrieved_chunks)
        output = generator.generate(question, reranked_chunks)

        results.append(
            {
                "question": question,
                "answer": output["answer"],
                "contexts": contexts,
                "ground_truth": ground_truth,
            }
        )

    logger.info("Building ragas dataset and running evaluation...")
    dataset = Dataset.from_list(results)
    ragas_result = evaluate(
        dataset,
        metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
    )

    return ragas_result, results


if __name__ == "__main__":
    try:
        ragas_result, raw_results = run_eval()

        faith = float(ragas_result["faithfulness"])
        relevancy = float(ragas_result["answer_relevancy"])
        precision = float(ragas_result["context_precision"])
        recall = float(ragas_result["context_recall"])
        average = (faith + relevancy + precision + recall) / 4

        print("\n================================")
        print("RAG EVALUATION RESULTS")
        print("================================")
        print(f"Faithfulness:        {faith:.2f}")
        print(f"Answer Relevancy:    {relevancy:.2f}")
        print(f"Context Precision:   {precision:.2f}")
        print(f"Context Recall:      {recall:.2f}")
        print("================================")
        print(f"Overall Average:     {average:.2f}")
        print("================================\n")

        output_path = "backend/eval_results.json"
        payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "scores": {
                "faithfulness": faith,
                "answer_relevancy": relevancy,
                "context_precision": precision,
                "context_recall": recall,
                "overall_average": average,
            },
            "results": raw_results,
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

        print(f"Full results saved to {output_path}")

    except Exception as exc:
        logger.error(f"Evaluation failed: {exc}")
        print(f"\nError: evaluation failed — {exc}", file=sys.stderr)
        sys.exit(1)
