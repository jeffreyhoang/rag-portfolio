from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from backend.services.chunker import DocumentLoader, TextChunker


# ---------------------------------------------------------------------------
# DocumentLoader tests
# ---------------------------------------------------------------------------


def test_load_txt_file(tmp_path: Path) -> None:
    """load() returns one document for a .txt file with correct metadata."""
    txt = tmp_path / "resume.txt"
    txt.write_text("Hello world", encoding="utf-8")

    loader = DocumentLoader(directory=str(tmp_path))
    docs = loader.load()

    assert len(docs) == 1
    assert docs[0]["text"] == "Hello world"
    assert docs[0]["source"] == "resume.txt"
    assert docs[0]["page"] == 1


def test_load_md_file(tmp_path: Path) -> None:
    """load() returns one document for a .md file with page=1."""
    md = tmp_path / "bio.md"
    md.write_text("# Bio\nI am Jeff.", encoding="utf-8")

    loader = DocumentLoader(directory=str(tmp_path))
    docs = loader.load()

    assert len(docs) == 1
    assert docs[0]["source"] == "bio.md"
    assert docs[0]["page"] == 1


def test_load_pdf_file(tmp_path: Path) -> None:
    """load() returns one document per PDF page with correct page numbers."""
    fake_page1 = MagicMock()
    fake_page1.extract_text.return_value = "Page one content"
    fake_page2 = MagicMock()
    fake_page2.extract_text.return_value = "Page two content"

    pdf_path = tmp_path / "resume.pdf"
    pdf_path.write_bytes(b"%PDF-1.4 fake")  # file must exist for iterdir()

    with patch("backend.services.chunker.PdfReader") as MockReader:
        MockReader.return_value.pages = [fake_page1, fake_page2]
        loader = DocumentLoader(directory=str(tmp_path))
        docs = loader.load()

    assert len(docs) == 2
    assert docs[0]["page"] == 1
    assert docs[0]["text"] == "Page one content"
    assert docs[1]["page"] == 2
    assert docs[1]["text"] == "Page two content"
    assert docs[0]["source"] == "resume.pdf"


def test_load_ignores_unsupported_types(tmp_path: Path) -> None:
    """load() silently ignores files with unsupported extensions."""
    (tmp_path / "data.csv").write_text("a,b,c", encoding="utf-8")
    (tmp_path / "notes.txt").write_text("keep me", encoding="utf-8")

    loader = DocumentLoader(directory=str(tmp_path))
    docs = loader.load()

    assert len(docs) == 1
    assert docs[0]["source"] == "notes.txt"


def test_load_multiple_files(tmp_path: Path) -> None:
    """load() returns documents for all supported files in the directory."""
    (tmp_path / "a.txt").write_text("aaa", encoding="utf-8")
    (tmp_path / "b.md").write_text("bbb", encoding="utf-8")
    (tmp_path / "skip.json").write_text("{}", encoding="utf-8")

    loader = DocumentLoader(directory=str(tmp_path))
    docs = loader.load()

    assert len(docs) == 2
    sources = {d["source"] for d in docs}
    assert sources == {"a.txt", "b.md"}


# ---------------------------------------------------------------------------
# TextChunker tests
# ---------------------------------------------------------------------------


def _make_doc(text: str, source: str = "test.txt", page: int = 1) -> dict:
    return {"text": text, "source": source, "page": page}


def test_chunk_respects_max_size() -> None:
    """chunk() produces chunks whose text length does not exceed chunk_size."""
    long_text = "word " * 1000  # ~5000 chars
    chunker = TextChunker(chunk_size=200, chunk_overlap=20)
    chunks = chunker.chunk([_make_doc(long_text)])

    assert len(chunks) > 1
    for c in chunks:
        assert len(c["text"]) <= 200


def test_chunk_inherits_metadata() -> None:
    """chunk() copies source and page from the parent document onto every chunk."""
    doc = _make_doc("Some content " * 50, source="bio.md", page=3)
    chunker = TextChunker(chunk_size=100, chunk_overlap=10)
    chunks = chunker.chunk([doc])

    for c in chunks:
        assert c["source"] == "bio.md"
        assert c["page"] == 3


def test_chunk_index_is_sequential() -> None:
    """chunk_index starts at 0 and increments within each document."""
    doc = _make_doc("token " * 300)
    chunker = TextChunker(chunk_size=100, chunk_overlap=0)
    chunks = chunker.chunk([doc])

    indices = [c["chunk_index"] for c in chunks]
    assert indices == list(range(len(chunks)))


def test_chunk_resets_index_per_document() -> None:
    """chunk_index resets to 0 for each new document."""
    docs = [
        _make_doc("alpha " * 200, source="a.txt"),
        _make_doc("beta " * 200, source="b.txt"),
    ]
    chunker = TextChunker(chunk_size=100, chunk_overlap=0)
    chunks = chunker.chunk(docs)

    for_a = [c for c in chunks if c["source"] == "a.txt"]
    for_b = [c for c in chunks if c["source"] == "b.txt"]
    assert for_a[0]["chunk_index"] == 0
    assert for_b[0]["chunk_index"] == 0


def test_chunk_short_document_produces_one_chunk() -> None:
    """A document shorter than chunk_size results in exactly one chunk."""
    doc = _make_doc("Short text.", source="short.txt")
    chunker = TextChunker(chunk_size=512, chunk_overlap=50)
    chunks = chunker.chunk([doc])

    assert len(chunks) == 1
    assert chunks[0]["text"] == "Short text."
    assert chunks[0]["chunk_index"] == 0


def test_chunk_empty_documents_list() -> None:
    """chunk() returns an empty list when given no documents."""
    chunker = TextChunker()
    assert chunker.chunk([]) == []
