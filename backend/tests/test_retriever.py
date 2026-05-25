from unittest.mock import MagicMock, patch

import pytest

from backend.services.retriever import Retriever, VectorStore


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_chunks(n: int) -> list[dict]:
    return [
        {
            "text": f"chunk {i}",
            "source": "doc.txt",
            "page": 1,
            "chunk_index": i,
            "embedding": [0.1, 0.2, float(i)],
        }
        for i in range(n)
    ]


@pytest.fixture()
def mock_collection():
    return MagicMock()


@pytest.fixture()
def vector_store(mock_collection):
    """VectorStore with a fully mocked ChromaDB client."""
    with patch("backend.services.retriever.chromadb.PersistentClient") as mock_client:
        mock_client.return_value.get_or_create_collection.return_value = mock_collection
        store = VectorStore()
    store._collection = mock_collection
    return store


@pytest.fixture()
def mock_embedder():
    embedder = MagicMock()
    embedder.embed_query.return_value = [0.5, 0.5, 0.5]
    return embedder


# ---------------------------------------------------------------------------
# VectorStore.add() tests
# ---------------------------------------------------------------------------


def test_add_calls_collection_with_correct_structure(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """add() passes ids, embeddings, documents, and metadatas to ChromaDB via upsert."""
    chunks = _make_chunks(2)
    vector_store.add(chunks)

    mock_collection.upsert.assert_called_once()
    call_kwargs = mock_collection.upsert.call_args.kwargs
    assert call_kwargs["ids"] == ["doc.txt__p1__c0", "doc.txt__p1__c1"]
    assert call_kwargs["documents"] == ["chunk 0", "chunk 1"]
    assert call_kwargs["metadatas"] == [
        {"source": "doc.txt", "page": 1, "chunk_index": 0},
        {"source": "doc.txt", "page": 1, "chunk_index": 1},
    ]
    assert len(call_kwargs["embeddings"]) == 2


def test_add_chroma_error_is_reraised(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """add() re-raises ChromaDB exceptions as RuntimeError with a message."""
    mock_collection.upsert.side_effect = Exception("disk full")
    with pytest.raises(RuntimeError, match="Failed to add chunks"):
        vector_store.add(_make_chunks(1))


# ---------------------------------------------------------------------------
# VectorStore.search() tests
# ---------------------------------------------------------------------------


def _mock_query_result(texts: list[str]) -> dict:
    return {
        "documents": [texts],
        "metadatas": [[{"source": "doc.txt", "page": 1, "chunk_index": i} for i in range(len(texts))]],
        "distances": [[0.1 * i for i in range(len(texts))]],
    }


def test_search_returns_expected_format(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """search() returns dicts with text, source, page, chunk_index, similarity_score."""
    mock_collection.query.return_value = _mock_query_result(["result one", "result two"])

    results = vector_store.search([0.1, 0.2, 0.3], top_k=2)

    assert len(results) == 2
    for r in results:
        assert "text" in r
        assert "source" in r
        assert "page" in r
        assert "chunk_index" in r
        assert "similarity_score" in r


def test_search_similarity_score_is_one_minus_distance(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """similarity_score equals 1.0 - cosine distance from ChromaDB."""
    mock_collection.query.return_value = _mock_query_result(["only result"])
    results = vector_store.search([0.1, 0.2, 0.3], top_k=1)
    assert results[0]["similarity_score"] == pytest.approx(1.0)


def test_search_chroma_error_is_reraised(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """search() re-raises ChromaDB exceptions as RuntimeError with a message."""
    mock_collection.query.side_effect = Exception("connection lost")
    with pytest.raises(RuntimeError, match="Failed to search"):
        vector_store.search([0.1, 0.2, 0.3])


# ---------------------------------------------------------------------------
# VectorStore.count() tests
# ---------------------------------------------------------------------------


def test_count_returns_collection_count(vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """count() returns the integer from collection.count()."""
    mock_collection.count.return_value = 42
    assert vector_store.count() == 42


# ---------------------------------------------------------------------------
# Retriever.retrieve() tests
# ---------------------------------------------------------------------------


def test_retrieve_embeds_query_once(mock_embedder: MagicMock, vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """retrieve() calls embedder.embed_query() exactly once."""
    mock_collection.query.return_value = _mock_query_result(["result"])
    retriever = Retriever(vector_store=vector_store, embedder=mock_embedder)

    retriever.retrieve("what projects have you built?")

    mock_embedder.embed_query.assert_called_once_with("what projects have you built?")


def test_retrieve_passes_embedding_to_search(mock_embedder: MagicMock, vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """retrieve() passes the embedding vector from the embedder to VectorStore.search()."""
    mock_collection.query.return_value = _mock_query_result(["result"])
    retriever = Retriever(vector_store=vector_store, embedder=mock_embedder)

    retriever.retrieve("what is your experience?")

    call_kwargs = mock_collection.query.call_args.kwargs
    assert call_kwargs["query_embeddings"] == [[0.5, 0.5, 0.5]]


def test_retrieve_returns_search_results(mock_embedder: MagicMock, vector_store: VectorStore, mock_collection: MagicMock) -> None:
    """retrieve() returns whatever VectorStore.search() returns."""
    mock_collection.query.return_value = _mock_query_result(["answer one", "answer two"])
    retriever = Retriever(vector_store=vector_store, embedder=mock_embedder)

    results = retriever.retrieve("tell me about yourself")

    assert len(results) == 2
    assert results[0]["text"] == "answer one"
