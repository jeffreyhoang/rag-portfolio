from typing import Any

import openai
from loguru import logger
from openai import OpenAI

from backend.config import settings


class Generator:
    """Assembles a grounded prompt and calls the OpenAI chat API to produce an answer."""

    REWRITE_PROMPT = (
        "You are a search query optimizer. Rephrase the user's question into a clear, "
        "specific search query that would retrieve relevant information from a resume and "
        "portfolio knowledge base. Preserve the original intent exactly. "
        "Return only the rewritten query with no explanation."
    )

    SYSTEM_PROMPT = (
        "You are a professional assistant on a developer portfolio website. "
        "Recruiters and hiring managers will ask you questions about the candidate. "
        "Answer ONLY from the context chunks provided in each message. "
        "When you use information from a chunk, cite the source inline using its filename "
        "in square brackets, e.g. [resume.pdf] or [projects.md]. "
        "If the answer is not present in the provided context, respond with exactly: "
        "'I don't have that information.' — never fabricate or infer beyond the context. "
        "Be concise and professional."
    )

    def __init__(self) -> None:
        """Initialize the OpenAI client and generation model from config."""
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.generation_model

    def rewrite_query(self, query: str) -> str:
        """Rewrite a vague user question into an explicit search query.

        Args:
            query: The original user question.

        Returns:
            A rewritten search query string, or the original query on failure.
        """
        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": self.REWRITE_PROMPT},
                    {"role": "user", "content": query},
                ],
            )
            rewritten: str = (response.choices[0].message.content or "").strip()
        except openai.RateLimitError as exc:
            logger.error(f"OpenAI rate limit hit during query rewrite: {exc}")
            return query
        except openai.APIError as exc:
            logger.error(f"OpenAI API error during query rewrite: {exc}")
            return query

        if not rewritten:
            logger.warning(f"rewrite_query returned empty; using original: {query!r}")
            return query

        logger.info(f"Query rewrite | original={query!r} | rewritten={rewritten!r}")
        return rewritten

    def generate(
        self,
        query: str,
        chunks: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> dict[str, Any]:
        """Generate a grounded answer from reranked chunks and the user query.

        Args:
            query: The user's plain text question.
            chunks: Reranked chunk dicts, each containing text, source, and page.
            history: Prior conversation messages with 'role' and 'content' keys.

        Returns:
            A dict with 'answer' (str) and 'sources' (deduplicated list of
            dicts with 'source' and 'page').
        """
        if history is None:
            history = []

        context = self._build_context(chunks)
        context_message = {
            "role": "user",
            "content": f"Context:\n{context}",
        }
        user_message = {"role": "user", "content": query}
        messages: list[dict[str, str]] = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            *history,
            context_message,
            user_message,
        ]

        approx_tokens = len(context.split())
        logger.info(
            f"Generating answer for query={query!r} using {len(chunks)} chunk(s), "
            f"~{approx_tokens} context tokens"
        )

        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=messages,
            )
            answer: str = response.choices[0].message.content or ""
        except openai.RateLimitError as exc:
            logger.error(f"OpenAI rate limit hit during generation: {exc}")
            raise RuntimeError("Generation failed: OpenAI rate limit exceeded. Try again later.") from exc
        except openai.APIError as exc:
            logger.error(f"OpenAI API error during generation: {exc}")
            raise RuntimeError(f"Generation failed: OpenAI API error — {exc}") from exc

        sources = self._deduplicate_sources(chunks)
        return {"answer": answer, "sources": sources}

    def _build_context(self, chunks: list[dict[str, Any]]) -> str:
        """Format context lines labelled by source filename for inline citation."""
        lines = []
        for chunk in chunks:
            lines.append(f'[{chunk["source"]}] (page {chunk["page"]}): "{chunk["text"]}"')
        return "\n".join(lines)

    def _deduplicate_sources(self, chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Return a deduplicated list of source dicts from chunks."""
        seen: set[tuple[str, int]] = set()
        sources: list[dict[str, Any]] = []
        for chunk in chunks:
            key = (chunk["source"], chunk["page"])
            if key not in seen:
                seen.add(key)
                sources.append({"source": chunk["source"], "page": chunk["page"]})
        return sources


class ConversationMemory:
    """Stores and retrieves a sliding window of conversation messages."""

    def __init__(self) -> None:
        """Initialize with an empty message history."""
        self._history: list[dict[str, str]] = []

    def add(self, role: str, content: str) -> None:
        """Append a message to the conversation history.

        Args:
            role: 'user' or 'assistant'.
            content: The message text.
        """
        self._history.append({"role": role, "content": content})

    def get(self, window_size: int | None = None) -> list[dict[str, str]]:
        """Return the last window_size messages.

        Defaults to config MEMORY_WINDOW_SIZE if window_size is None.
        """
        n = window_size if window_size is not None else settings.memory_window_size
        return self._history[-n:]

    def clear(self) -> None:
        """Reset the conversation history to empty."""
        self._history = []
