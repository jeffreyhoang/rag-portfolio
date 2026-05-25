from unittest.mock import MagicMock, patch

import openai
import pytest

from backend.services.embedder import Embedder


def _make_chunks(n: int) -> list[dict]:
    return [
        {"text": f"chunk {i}", "source": "doc.txt", "page": 1, "chunk_index": i}
        for i in range(n)
    ]


def _fake_response(texts: list[str]) -> MagicMock:
    """Build a mock OpenAI embeddings response for the given texts."""
    response = MagicMock()
    response.data = [MagicMock(embedding=[0.1, 0.2, float(i)]) for i in range(len(texts))]
    return response


@pytest.fixture()
def embedder(mocker) -> Embedder:
    """Return an Embedder with a patched OpenAI client."""
    mocker.patch("backend.services.embedder.OpenAI")
    return Embedder()


# ---------------------------------------------------------------------------
# Embedding key tests
# ---------------------------------------------------------------------------


def test_embed_adds_embedding_key(embedder: Embedder, mocker) -> None:
    """embed() adds an 'embedding' key containing a list of floats to every chunk."""
    chunks = _make_chunks(3)
    embedder._client.embeddings.create.side_effect = lambda model, input: _fake_response(input)

    result = embedder.embed(chunks)

    assert len(result) == 3
    for item in result:
        assert "embedding" in item
        assert isinstance(item["embedding"], list)
        assert all(isinstance(v, float) for v in item["embedding"])


def test_embed_preserves_metadata(embedder: Embedder) -> None:
    """embed() does not modify text, source, page, or chunk_index fields."""
    chunks = _make_chunks(2)
    embedder._client.embeddings.create.side_effect = lambda model, input: _fake_response(input)

    result = embedder.embed(chunks)

    for original, embedded in zip(chunks, result):
        assert embedded["text"] == original["text"]
        assert embedded["source"] == original["source"]
        assert embedded["page"] == original["page"]
        assert embedded["chunk_index"] == original["chunk_index"]


# ---------------------------------------------------------------------------
# Batching tests
# ---------------------------------------------------------------------------


def test_embed_batches_250_chunks_into_3_calls(embedder: Embedder) -> None:
    """embed() calls the API 3 times for 250 chunks (batches of 100)."""
    chunks = _make_chunks(250)
    embedder._client.embeddings.create.side_effect = lambda model, input: _fake_response(input)

    embedder.embed(chunks)

    assert embedder._client.embeddings.create.call_count == 3


def test_embed_correct_batch_sizes(embedder: Embedder) -> None:
    """Batches contain 100, 100, and 50 chunks respectively for 250 inputs."""
    chunks = _make_chunks(250)
    embedder._client.embeddings.create.side_effect = lambda model, input: _fake_response(input)

    embedder.embed(chunks)

    calls = embedder._client.embeddings.create.call_args_list
    batch_sizes = [len(call.kwargs["input"]) for call in calls]
    assert batch_sizes == [100, 100, 50]


# ---------------------------------------------------------------------------
# Error handling tests
# ---------------------------------------------------------------------------


def test_embed_rate_limit_error_is_reraised(embedder: Embedder) -> None:
    """embed() catches RateLimitError and re-raises as RuntimeError with a message."""
    chunks = _make_chunks(1)
    embedder._client.embeddings.create.side_effect = openai.RateLimitError(
        message="rate limit", response=MagicMock(), body={}
    )

    with pytest.raises(RuntimeError, match="rate limit"):
        embedder.embed(chunks)


def test_embed_api_error_is_reraised(embedder: Embedder) -> None:
    """embed() catches APIError and re-raises as RuntimeError with a message."""
    chunks = _make_chunks(1)
    embedder._client.embeddings.create.side_effect = openai.APIError(
        message="api error", request=MagicMock(), body={}
    )

    with pytest.raises(RuntimeError, match="API error"):
        embedder.embed(chunks)
