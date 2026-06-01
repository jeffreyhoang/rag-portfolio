from pathlib import Path
from typing import TypedDict

from langchain_text_splitters import RecursiveCharacterTextSplitter
from loguru import logger
from pypdf import PdfReader

from backend.config import settings

import re


class Document(TypedDict):
    text: str
    source: str
    page: int


class Chunk(TypedDict):
    text: str
    source: str
    page: int
    chunk_index: int

def clean_text(text: str) -> str:
    """Strip markdown formatting from text while preserving all words and sentences."""

    # Remove horizontal rules
    text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)

    # Remove heading markers but keep the heading text
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)

    # Remove bold and italic markers (**text**, *text*, __text__, _text_)
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'__(.+?)__', r'\1', text)
    text = re.sub(r'_(.+?)_', r'\1', text)

    # Remove inline code backticks but keep the text
    text = re.sub(r'`(.+?)`', r'\1', text)

    # Remove fenced code blocks entirely
    text = re.sub(r'```[\s\S]*?```', '', text)

    # Remove blockquotes marker but keep text
    text = re.sub(r'^>\s+', '', text, flags=re.MULTILINE)

    # Remove bullet and numbered list markers but keep text
    text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)

    # Remove markdown links but keep the display text
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)

    # Remove markdown images entirely
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)

    # Remove HTML tags if any slipped in
    text = re.sub(r'<[^>]+>', '', text)

    # Collapse multiple blank lines into one
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Strip leading and trailing whitespace
    text = text.strip()

    return text


class DocumentLoader:
    """Loads .pdf, .md, and .txt files from a directory into document dicts."""

    def __init__(self, directory: str | None = None) -> None:
        """Initialize with a directory path, defaulting to data/documents/."""
        self.directory = (
            Path(directory)
            if directory
            else Path(__file__).parents[2] / "data" / "documents"
        )

    def load(self) -> list[Document]:
        """Read all supported files and return document dicts.

        Returns one document per page for PDFs, one per file for .md/.txt.
        """
        documents: list[Document] = []
        supported = {".pdf", ".md", ".txt"}
        files = [
            f for f in self.directory.rglob("*") if f.is_file() and f.suffix in supported
        ]

        for file in files:
            if file.suffix == ".pdf":
                reader = PdfReader(str(file))
                for page_num, page in enumerate(reader.pages, start=1):
                    text = page.extract_text() or ""
                    documents.append({"text": text, "source": file.name, "page": page_num})
            else:
                text = file.read_text(encoding="utf-8")
                documents.append({"text": text, "source": file.name, "page": 1})

        logger.info(
            f"Loaded {len(files)} file(s) → {len(documents)} document(s) from {self.directory}"
        )
        return documents


class TextChunker:
    """Splits documents into overlapping text chunks using LangChain's splitter."""

    def __init__(
        self,
        chunk_size: int = settings.chunk_size,
        chunk_overlap: int = settings.chunk_overlap,
    ) -> None:
        """Initialize with chunk size and overlap, defaulting to config values."""
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def chunk(self, documents: list[Document]) -> list[Chunk]:
        """Split documents into chunks with inherited metadata.

        Each chunk carries the source filename, page number, and its
        zero-based index within the originating document.
        """
        chunks: list[Chunk] = []
        for doc in documents:
            doc["text"] = clean_text(doc["text"])
            pieces = self._splitter.split_text(doc["text"])
            for idx, piece in enumerate(pieces):
                chunks.append(
                    {
                        f"text": piece,
                        "source": doc["source"],
                        "page": doc["page"],
                        "chunk_index": idx,
                    }
                )
        logger.info(
            f"Produced {len(chunks)} chunk(s) from {len(documents)} document(s)"
        )
        return chunks
