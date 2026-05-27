import importlib
from unittest.mock import MagicMock, PropertyMock

import pytest
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture()
def client(mocker):
    """TestClient with all five services patched at the source module level.

    Patching at the source (e.g. backend.services.generator.Generator) means
    that when chat.py is reloaded its `from ... import X` statements pull in
    the mocked classes, so module-level instantiation produces MagicMocks.
    """
    mocker.patch("backend.services.embedder.Embedder")
    mocker.patch("backend.services.retriever.VectorStore")
    mocker.patch("backend.services.retriever.Retriever")
    mocker.patch("backend.services.reranker.Reranker")
    mocker.patch("backend.services.generator.Generator")
    # ConversationMemory is pure Python — let it run for real so session
    # tests can inspect actual history state.

    import backend.routers.chat as chat_module
    importlib.reload(chat_module)

    # Configure default return values on the now-mock singletons.
    chat_module.generator.rewrite_query.return_value = "rewritten query"
    chat_module.retriever.retrieve.return_value = [
        {"text": "chunk text", "source": "resume.pdf", "page": 1, "chunk_index": 0, "similarity_score": 0.9}
    ]
    chat_module.reranker.rerank.return_value = [
        {"text": "chunk text", "source": "resume.pdf", "page": 1, "chunk_index": 0, "rerank_score": 0.95}
    ]
    chat_module.generator.generate.return_value = {
        "answer": "Generated answer",
        "sources": [{"source": "resume.pdf", "page": 1}],
    }
    chat_module.reranker.model_name = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    chat_module.store.count.return_value = 42
    chat_module.sessions.clear()

    from backend.main import app

    # Swap in the freshly reloaded router (drop stale /api routes first).
    app.router.routes = [
        r for r in app.router.routes
        if not getattr(r, "path", "").startswith("/api/chat")
        and not getattr(r, "path", "").startswith("/api/health")
    ]
    app.include_router(chat_module.router, prefix="/api")

    return TestClient(app)


# ---------------------------------------------------------------------------
# POST /api/chat — happy path
# ---------------------------------------------------------------------------


def test_chat_returns_200_with_expected_fields(client: TestClient) -> None:
    """POST /api/chat returns 200 with answer, sources, session_id, rewritten_query."""
    response = client.post("/api/chat", json={"query": "What is your experience?", "session_id": "s1"})
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Generated answer"
    assert data["session_id"] == "s1"
    assert data["rewritten_query"] == "rewritten query"
    assert isinstance(data["sources"], list)
    assert data["sources"][0]["source"] == "resume.pdf"


# ---------------------------------------------------------------------------
# POST /api/chat — validation
# ---------------------------------------------------------------------------


def test_chat_returns_400_for_empty_query(client: TestClient) -> None:
    """POST /api/chat returns 400 when query is an empty string."""
    response = client.post("/api/chat", json={"query": "", "session_id": "s1"})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_chat_returns_400_for_whitespace_query(client: TestClient) -> None:
    """POST /api/chat returns 400 when query is whitespace only."""
    response = client.post("/api/chat", json={"query": "   ", "session_id": "s1"})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


# ---------------------------------------------------------------------------
# POST /api/chat — session memory
# ---------------------------------------------------------------------------


def test_same_session_accumulates_history(client: TestClient) -> None:
    """Two requests with the same session_id accumulate history for both turns."""
    import backend.routers.chat as chat_module

    client.post("/api/chat", json={"query": "first question", "session_id": "sess-a"})
    client.post("/api/chat", json={"query": "second question", "session_id": "sess-a"})

    history = chat_module.sessions["sess-a"].get()
    roles = [m["role"] for m in history]
    assert roles == ["user", "assistant", "user", "assistant"]


def test_different_sessions_use_separate_memory(client: TestClient) -> None:
    """Two different session_ids result in independent ConversationMemory instances."""
    import backend.routers.chat as chat_module

    client.post("/api/chat", json={"query": "question A", "session_id": "sess-x"})
    client.post("/api/chat", json={"query": "question B", "session_id": "sess-y"})

    assert "sess-x" in chat_module.sessions
    assert "sess-y" in chat_module.sessions
    assert chat_module.sessions["sess-x"] is not chat_module.sessions["sess-y"]


# ---------------------------------------------------------------------------
# POST /api/chat — error handling
# ---------------------------------------------------------------------------


def test_chat_returns_500_when_retriever_raises(client: TestClient) -> None:
    """POST /api/chat returns 500 when retriever.retrieve() raises RuntimeError."""
    import backend.routers.chat as chat_module

    chat_module.retriever.retrieve.side_effect = RuntimeError("retrieval failed")

    response = client.post("/api/chat", json={"query": "Tell me about yourself", "session_id": "err1"})
    assert response.status_code == 500
    assert "retrieval failed" in response.json()["detail"]


def test_chat_returns_500_when_generator_raises(client: TestClient) -> None:
    """POST /api/chat returns 500 when generator.generate() raises RuntimeError."""
    import backend.routers.chat as chat_module

    chat_module.retriever.retrieve.side_effect = None
    chat_module.generator.generate.side_effect = RuntimeError("generation failed")

    response = client.post("/api/chat", json={"query": "Tell me about yourself", "session_id": "err2"})
    assert response.status_code == 500
    assert "generation failed" in response.json()["detail"]


# ---------------------------------------------------------------------------
# GET /api/health
# ---------------------------------------------------------------------------


def test_health_returns_200_with_expected_fields(client: TestClient) -> None:
    """GET /api/health returns 200 with status, document_count, and model names."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["document_count"] == 42
    assert "rerank_model" in data
    assert "generation_model" in data


def test_health_returns_degraded_when_store_count_raises(client: TestClient) -> None:
    """GET /api/health returns degraded status when store.count() raises."""
    import backend.routers.chat as chat_module

    chat_module.store.count.side_effect = Exception("db down")

    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "degraded"
    assert data["document_count"] == 0
