from typing import Any

from loguru import logger
from sentence_transformers import CrossEncoder

from backend.config import settings

class Reranker:
    """Re-scores retrieved chunks with a cross-encoder model and keeps the best ones."""

    def __init__(self) -> None:
        """Load the cross-encoder model from sentence-transformers."""
        self._model = CrossEncoder(settings.rerank_model)

    @property
    def model_name(self) -> str:
        """Return the name of the loaded cross-encoder model."""
        return settings.rerank_model

    def rerank(
        self,
        query: str,
        chunks: list[dict[str, Any]],
        top_k: int | None = None,
    ) -> list[dict[str, Any]]:
        """Re-score chunks against the query and return the top_k best results.

        Scores all (query, chunk_text) pairs in a single model.predict() call,
        adds a 'rerank_score' key to each chunk, sorts descending, and returns
        only the top_k chunks. Defaults to config TOP_K_RERANK if top_k is None.
        """
        resolved_top_k = top_k if top_k is not None else settings.top_k_rerank
        pairs = [(query, chunk["text"]) for chunk in chunks]
        scores: list[float] = self._model.predict(pairs).tolist()

        scored: list[dict[str, Any]] = [
            {**chunk, "rerank_score": score} for chunk, score in zip(chunks, scores)
        ]
        scored.sort(key=lambda c: c["rerank_score"], reverse=True)
        kept = scored[:resolved_top_k]

        logger.info(
            f"Reranked {len(chunks)} chunk(s) → kept {len(kept)}, "
            f"top score {kept[0]['rerank_score']:.4f}" if kept else
            f"Reranked {len(chunks)} chunk(s) → kept 0"
        )
        return kept
