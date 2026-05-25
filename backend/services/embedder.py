from typing import Any

import openai
from loguru import logger
from openai import OpenAI

from backend.config import settings


class Embedder:
    """Converts text chunks into vector embeddings via the OpenAI embedding API."""

    def __init__(self) -> None:
        """Initialize the OpenAI client and embedding model from config."""
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.embedding_model
        self._batch_size = settings.embedding_batch_size

    def embed(self, chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Add an 'embedding' key to each chunk dict by calling the OpenAI API.

        Chunks are sent in batches to avoid rate limits. All original
        metadata keys (text, source, page, chunk_index) are preserved.
        """
        results: list[dict[str, Any]] = []
        total_batches = (len(chunks) + self._batch_size - 1) // self._batch_size

        for batch_num, start in enumerate(range(0, len(chunks), self._batch_size), start=1):
            batch = chunks[start : start + self._batch_size]
            embeddings = self._embed_batch(batch)
            for chunk, vector in zip(batch, embeddings):
                results.append({**chunk, "embedding": vector})
            logger.info(f"Embedded batch {batch_num}/{total_batches} ({len(batch)} chunks)")

        logger.info(f"Finished embedding {len(results)} chunk(s) in {total_batches} batch(es)")
        return results

    def embed_query(self, text: str) -> list[float]:
        """Embed a single plain-text query string and return its vector.

        Unlike embed(), this accepts a raw string rather than a chunk dict.
        """
        try:
            response = self._client.embeddings.create(model=self._model, input=[text])
            return response.data[0].embedding
        except openai.RateLimitError as exc:
            logger.error(f"OpenAI rate limit hit while embedding query: {exc}")
            raise RuntimeError("Embedding failed: OpenAI rate limit exceeded. Try again later.") from exc
        except openai.APIError as exc:
            logger.error(f"OpenAI API error while embedding query: {exc}")
            raise RuntimeError(f"Embedding failed: OpenAI API error — {exc}") from exc

    def _embed_batch(self, batch: list[dict[str, Any]]) -> list[list[float]]:
        """Send one batch of chunks to the OpenAI embedding API.

        Returns a list of embedding vectors in the same order as the input.
        """
        texts = [chunk["text"] for chunk in batch]
        try:
            response = self._client.embeddings.create(model=self._model, input=texts)
            return [item.embedding for item in response.data]
        except openai.RateLimitError as exc:
            logger.error(f"OpenAI rate limit hit while embedding batch: {exc}")
            raise RuntimeError("Embedding failed: OpenAI rate limit exceeded. Try again later.") from exc
        except openai.APIError as exc:
            logger.error(f"OpenAI API error while embedding batch: {exc}")
            raise RuntimeError(f"Embedding failed: OpenAI API error — {exc}") from exc
