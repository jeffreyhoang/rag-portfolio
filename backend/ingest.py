import sys

from loguru import logger

from backend.config import settings
from backend.services.chunker import DocumentLoader, TextChunker
from backend.services.embedder import Embedder
from backend.services.retriever import VectorStore


def run_ingestion() -> int:
    """Run the full document ingestion pipeline.

    Loads documents from data/documents/, chunks them, embeds each chunk
    via OpenAI, and stores the results in ChromaDB. Returns the number of
    chunks stored. Exits cleanly with a warning if no supported files are found.
    """
    loader = DocumentLoader()
    chunker = TextChunker()
    embedder = Embedder()
    store = VectorStore()

    logger.info(f"Loading documents from {loader.directory}...")
    documents = loader.load()
    logger.info(f"Loaded {len(documents)} document(s)")

    if not documents:
        logger.warning("No supported documents found — nothing to ingest.")
        return 0

    logger.info("Chunking documents...")
    chunks = chunker.chunk(documents)
    logger.info(f"Created {len(chunks)} chunk(s)")

    logger.info(f"Embedding {len(chunks)} chunks in batches...")
    embedded_chunks = embedder.embed(chunks)

    logger.info("Storing chunks in ChromaDB...")
    store.add(embedded_chunks)
    logger.info(f"Ingestion complete — {len(embedded_chunks)} chunks stored")

    return len(embedded_chunks)


if __name__ == "__main__":
    try:
        count = run_ingestion()
        print(f"\nIngestion complete.")
        print(f"  Chunks stored : {count}")
        print(f"  ChromaDB path : {settings.chroma_persist_dir}")
    except Exception as exc:
        logger.error(f"Ingestion failed: {exc}")
        print(f"\nError: ingestion failed — {exc}", file=sys.stderr)
        sys.exit(1)
