# RAG Portfolio Assistant

**Summary:** A production-deployed personal AI assistant on Jeffrey's portfolio website that answers recruiter questions using retrieval-augmented generation.
**Tech Stack:** Python, FastAPI, LangChain, ChromaDB, Pinecone, OpenAI API, sentence-transformers, rank-bm25, ragas, React, Tailwind CSS, Railway, Vercel
**Deployed:** Railway (backend) · Vercel (frontend)

## What I Built

Built a full retrieval-augmented generation pipeline consisting of five independent services:
- Document loader and chunker using recursive character splitting with configurable overlap
- OpenAI embedding service that converts document chunks into vector representations in batches
- ChromaDB vector store with cosine similarity search for top-k retrieval
- Cross-encoder reranker using ms-marco-MiniLM-L-6-v2 to rescore and filter retrieved chunks
- Generation service that assembles a grounded prompt with numbered citations and calls the OpenAI chat completions API

Hybrid search combines dense vector retrieval with BM25 keyword search merged via Reciprocal Rank Fusion, ensuring strong performance on both semantic and exact-match queries.

Supports multi-turn conversation through a sliding window memory that maintains the last ten turns of context.

## Evaluation

Every component is evaluated using the ragas framework measuring faithfulness, answer relevancy, context precision, and context recall.

## Engineering Practices

- Fully tested with pytest, all external API calls mocked
- Environment-based configuration using pydantic-settings
- Deployed with CI/CD on Railway and Vercel

## Why I Built It

Built independently to demonstrate production-quality AI engineering without relying on an internship or external guidance.
