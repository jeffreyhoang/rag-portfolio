from unittest.mock import MagicMock, patch

import numpy as np
import pytest

from backend.services.reranker import Reranker


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
            "similarity_score": 0.9 - i * 0.05,
        }
        for i in range(n)
    ]


@pytest.fixture()
def reranker(mocker) -> Reranker:
    """Reranker with a mocked CrossEncoder — no model download."""
    mocker.patch("backend.services.reranker.CrossEncoder")
    return Reranker()


# ---------------------------------------------------------------------------
# rerank() tests
# ---------------------------------------------------------------------------


def test_rerank_returns_top_k_chunks(reranker: Reranker) -> None:
    """rerank() returns exactly TOP_K_RERANK chunks (default 3)."""
    chunks = _make_chunks(10)
    reranker._model.predict.return_value = np.array([float(i) for i in range(10)])

    result = reranker.rerank("what is your experience?", chunks)

    assert len(result) == 3


def test_rerank_returns_custom_top_k(reranker: Reranker) -> None:
    """rerank() respects an explicit top_k argument."""
    chunks = _make_chunks(10)
    reranker._model.predict.return_value = np.array([float(i) for i in range(10)])

    result = reranker.rerank("query", chunks, top_k=5)

    assert len(result) == 5


def test_rerank_sorted_descending(reranker: Reranker) -> None:
    """rerank() returns chunks sorted by rerank_score highest first."""
    chunks = _make_chunks(5)
    # assign scores out of order: chunk 2 is best, chunk 0 is worst
    reranker._model.predict.return_value = np.array([0.1, 0.5, 0.9, 0.3, 0.7])

    result = reranker.rerank("query", chunks, top_k=5)

    scores = [r["rerank_score"] for r in result]
    assert scores == sorted(scores, reverse=True)


def test_rerank_adds_rerank_score_key(reranker: Reranker) -> None:
    """rerank() adds a 'rerank_score' float key to every returned chunk."""
    chunks = _make_chunks(5)
    reranker._model.predict.return_value = np.array([0.1, 0.5, 0.9, 0.3, 0.7])

    result = reranker.rerank("query", chunks)

    for chunk in result:
        assert "rerank_score" in chunk
        assert isinstance(chunk["rerank_score"], float)


def test_rerank_preserves_metadata(reranker: Reranker) -> None:
    """rerank() does not lose text, source, page, chunk_index, or similarity_score."""
    chunks = _make_chunks(5)
    reranker._model.predict.return_value = np.array([0.1, 0.5, 0.9, 0.3, 0.7])

    result = reranker.rerank("query", chunks)

    for r in result:
        assert "text" in r
        assert "source" in r
        assert "page" in r
        assert "chunk_index" in r
        assert "similarity_score" in r


def test_rerank_predict_called_once_with_all_pairs(reranker: Reranker) -> None:
    """model.predict() is called once with all (query, chunk_text) pairs — not per chunk."""
    chunks = _make_chunks(10)
    reranker._model.predict.return_value = np.array([float(i) for i in range(10)])
    query = "tell me about your projects"

    reranker.rerank(query, chunks)

    reranker._model.predict.assert_called_once()
    call_args = reranker._model.predict.call_args[0][0]
    assert len(call_args) == 10
    assert all(pair[0] == query for pair in call_args)
    assert call_args[0] == (query, "chunk 0")


def test_model_name_property(reranker: Reranker) -> None:
    """model_name property returns the model string from config."""
    from backend.config import settings
    assert reranker.model_name == settings.rerank_model
