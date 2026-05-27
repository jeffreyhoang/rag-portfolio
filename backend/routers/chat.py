from fastapi import APIRouter, HTTPException
from loguru import logger

from backend.config import settings
from backend.models.schemas import ChatRequest, ChatResponse, HealthResponse, SourceSchema
from backend.services.embedder import Embedder
from backend.services.generator import ConversationMemory, Generator
from backend.services.reranker import Reranker
from backend.services.retriever import Retriever, VectorStore

router = APIRouter()

# Services are instantiated once at module load — not per request.
embedder = Embedder()
store = VectorStore()
retriever = Retriever(vector_store=store, embedder=embedder)
reranker = Reranker()
generator = Generator()

sessions: dict[str, ConversationMemory] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Run the full RAG pipeline and return a grounded answer with sources."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    session_id = request.session_id
    if session_id not in sessions:
        sessions[session_id] = ConversationMemory()

    try:
        rewritten = generator.rewrite_query(query)
        chunks = retriever.retrieve(rewritten)
        chunks = reranker.rerank(rewritten, chunks)
        result = generator.generate(query, chunks, sessions[session_id].get())
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.error(f"Unexpected error in /chat: {exc}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred") from exc

    sessions[session_id].add("user", query)
    sessions[session_id].add("assistant", result["answer"])

    logger.info(
        f"session={session_id!r} query={query!r} rewritten={rewritten!r} "
        f"answer_len={len(result['answer'])}"
    )

    return ChatResponse(
        answer=result["answer"],
        sources=[SourceSchema(**s) for s in result["sources"]],
        session_id=session_id,
        rewritten_query=rewritten,
    )


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Return vector store document count and model info."""
    try:
        doc_count = store.count()
        return HealthResponse(
            status="ok",
            document_count=doc_count,
            rerank_model=reranker.model_name,
            generation_model=settings.generation_model,
        )
    except Exception as exc:
        logger.error(f"Health check failed: {exc}")
        return HealthResponse(
            status="degraded",
            document_count=0,
            rerank_model=reranker.model_name,
            generation_model=settings.generation_model,
        )
