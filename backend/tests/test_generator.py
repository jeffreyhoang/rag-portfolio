from unittest.mock import MagicMock, patch

import openai
import pytest

from backend.services.generator import ConversationMemory, Generator


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_chunks(sources: list[tuple[str, int]] | None = None) -> list[dict]:
    if sources is None:
        sources = [("resume.pdf", 2), ("projects.md", 1), ("bio.txt", 1)]
    return [
        {
            "text": f"Content from {src} page {pg}",
            "source": src,
            "page": pg,
            "chunk_index": i,
            "rerank_score": 0.9 - i * 0.1,
        }
        for i, (src, pg) in enumerate(sources)
    ]


def _mock_completion(text: str = "Generated answer") -> MagicMock:
    response = MagicMock()
    response.choices[0].message.content = text
    return response


@pytest.fixture()
def generator(mocker) -> Generator:
    """Generator with a mocked OpenAI client."""
    mocker.patch("backend.services.generator.OpenAI")
    return Generator()


# ---------------------------------------------------------------------------
# Context string format
# ---------------------------------------------------------------------------


def test_context_is_numbered_with_source_and_page(generator: Generator) -> None:
    """generate() builds context with [N] (source, page N): "text" format."""
    chunks = _make_chunks()
    generator._client.chat.completions.create.return_value = _mock_completion()

    generator.generate("query", chunks)

    call_messages = generator._client.chat.completions.create.call_args.kwargs["messages"]
    context_msg = next(m for m in call_messages if "Context:" in m["content"])
    assert '[1] (resume.pdf, page 2): "Content from resume.pdf page 2"' in context_msg["content"]
    assert '[2] (projects.md, page 1): "Content from projects.md page 1"' in context_msg["content"]
    assert '[3] (bio.txt, page 1): "Content from bio.txt page 1"' in context_msg["content"]


# ---------------------------------------------------------------------------
# Messages structure
# ---------------------------------------------------------------------------


def test_system_prompt_is_first_message(generator: Generator) -> None:
    """The system prompt is always the first message sent to the API."""
    generator._client.chat.completions.create.return_value = _mock_completion()

    generator.generate("any query", _make_chunks())

    messages = generator._client.chat.completions.create.call_args.kwargs["messages"]
    assert messages[0]["role"] == "system"
    assert messages[0]["content"] == Generator.SYSTEM_PROMPT


def test_history_placed_after_system_prompt(generator: Generator) -> None:
    """History messages appear between the system prompt and the context."""
    history = [
        {"role": "user", "content": "previous question"},
        {"role": "assistant", "content": "previous answer"},
    ]
    generator._client.chat.completions.create.return_value = _mock_completion()

    generator.generate("new question", _make_chunks(), history=history)

    messages = generator._client.chat.completions.create.call_args.kwargs["messages"]
    assert messages[1] == history[0]
    assert messages[2] == history[1]
    # context comes after history
    assert "Context:" in messages[3]["content"]


def test_empty_history_is_accepted(generator: Generator) -> None:
    """generate() works with no history (default empty list)."""
    generator._client.chat.completions.create.return_value = _mock_completion()
    result = generator.generate("query", _make_chunks())
    assert "answer" in result


# ---------------------------------------------------------------------------
# Return value
# ---------------------------------------------------------------------------


def test_generate_returns_answer_and_sources_keys(generator: Generator) -> None:
    """generate() returns a dict with 'answer' and 'sources' keys."""
    generator._client.chat.completions.create.return_value = _mock_completion("My answer")

    result = generator.generate("query", _make_chunks())

    assert result["answer"] == "My answer"
    assert "sources" in result
    assert isinstance(result["sources"], list)


def test_sources_are_deduplicated(generator: Generator) -> None:
    """Duplicate (source, page) pairs appear only once in 'sources'."""
    # two chunks from the same source+page
    chunks = _make_chunks([("resume.pdf", 2), ("resume.pdf", 2), ("bio.txt", 1)])
    generator._client.chat.completions.create.return_value = _mock_completion()

    result = generator.generate("query", chunks)

    resume_entries = [s for s in result["sources"] if s["source"] == "resume.pdf"]
    assert len(resume_entries) == 1


def test_sources_contain_source_and_page(generator: Generator) -> None:
    """Each entry in 'sources' has 'source' and 'page' keys."""
    generator._client.chat.completions.create.return_value = _mock_completion()

    result = generator.generate("query", _make_chunks())

    for s in result["sources"]:
        assert "source" in s
        assert "page" in s


# ---------------------------------------------------------------------------
# Error handling
# ---------------------------------------------------------------------------


def test_rate_limit_error_is_reraised(generator: Generator) -> None:
    """generate() catches RateLimitError and re-raises as RuntimeError."""
    generator._client.chat.completions.create.side_effect = openai.RateLimitError(
        message="rate limit", response=MagicMock(), body={}
    )
    with pytest.raises(RuntimeError, match="rate limit"):
        generator.generate("query", _make_chunks())


def test_api_error_is_reraised(generator: Generator) -> None:
    """generate() catches APIError and re-raises as RuntimeError."""
    generator._client.chat.completions.create.side_effect = openai.APIError(
        message="api error", request=MagicMock(), body={}
    )
    with pytest.raises(RuntimeError, match="API error"):
        generator.generate("query", _make_chunks())


# ---------------------------------------------------------------------------
# ConversationMemory
# ---------------------------------------------------------------------------


def test_memory_get_returns_last_n_messages() -> None:
    """get() returns only the last MEMORY_WINDOW_SIZE messages."""
    mem = ConversationMemory()
    for i in range(15):
        mem.add("user", f"message {i}")

    result = mem.get(window_size=10)

    assert len(result) == 10
    assert result[0]["content"] == "message 5"
    assert result[-1]["content"] == "message 14"


def test_memory_get_returns_all_when_fewer_than_window() -> None:
    """get() returns all messages when history is shorter than window_size."""
    mem = ConversationMemory()
    mem.add("user", "only message")

    result = mem.get(window_size=10)

    assert len(result) == 1


def test_memory_clear_resets_history() -> None:
    """clear() empties the message history."""
    mem = ConversationMemory()
    mem.add("user", "hello")
    mem.add("assistant", "hi")

    mem.clear()

    assert mem.get() == []


def test_memory_add_stores_role_and_content() -> None:
    """add() stores the role and content correctly."""
    mem = ConversationMemory()
    mem.add("user", "what projects have you done?")

    result = mem.get()

    assert result[0] == {"role": "user", "content": "what projects have you done?"}
