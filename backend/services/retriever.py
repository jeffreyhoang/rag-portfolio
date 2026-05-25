from typing import Any

import chromadb
from loguru import logger

from backend.config import settings
from backend.services.embedder import Embedder


class VectorStore:
    """Persistent ChromaDB-backed vector store for portfolio chunks."""

    def __init__(self) -> None:
        """Initialize the ChromaDB client and collection from config."""
        self._client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def add(self, chunks: list[dict[str, Any]]) -> None:
        """Store embedded chunks in ChromaDB.

        Each chunk must contain text, source, page, chunk_index, and embedding.
        """
        try:
            ids = [f"{c['source']}__p{c['page']}__c{c['chunk_index']}" for c in chunks]
            embeddings = [c["embedding"] for c in chunks]
            documents = [c["text"] for c in chunks]
            metadatas = [
                {"source": c["source"], "page": c["page"], "chunk_index": c["chunk_index"]}
                for c in chunks
            ]
            self._collection.upsert(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas,
            )
            logger.info(f"Upserted {len(chunks)} chunk(s) into collection '{settings.chroma_collection_name}'")
        except Exception as exc:
            logger.error(f"ChromaDB add failed: {exc}")
            raise RuntimeError(f"Failed to add chunks to vector store: {exc}") from exc

    def search(
        self,
        query_embedding: list[float],
        top_k: int | None = None,
    ) -> list[dict[str, Any]]:
        """Query ChromaDB for the most similar chunks to the given embedding.

        Returns a list of dicts with text, source, page, chunk_index, and
        similarity_score (higher is more similar for cosine distance).
        """
        resolved_top_k = top_k if top_k is not None else settings.top_k_retrieval
        try:
            results = self._collection.query(
                query_embeddings=[query_embedding],
                n_results=resolved_top_k,
                include=["documents", "metadatas", "distances"],
            )
            output: list[dict[str, Any]] = []
            documents = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            for doc, meta, dist in zip(documents, metadatas, distances):
                output.append(
                    {
                        "text": doc,
                        "source": meta["source"],
                        "page": meta["page"],
                        "chunk_index": meta["chunk_index"],
                        "similarity_score": 1.0 - dist,
                    }
                )
            logger.info(f"Retrieved {len(output)} result(s) from vector store")
            return output
        except Exception as exc:
            logger.error(f"ChromaDB search failed: {exc}")
            raise RuntimeError(f"Failed to search vector store: {exc}") from exc

    def count(self) -> int:
        """Return the total number of documents stored in the collection."""
        return self._collection.count()


class Retriever:
    """Single entry point for query-time retrieval over the vector store."""

    def __init__(self, vector_store: VectorStore, embedder: Embedder) -> None:
        """Initialize with a VectorStore and Embedder instance."""
        self._store = vector_store
        self._embedder = embedder

    def retrieve(self, query: str, top_k: int | None = None) -> list[dict[str, Any]]:
        """Embed a plain-text query and return the most relevant chunks.

        Args:
            query: The natural language question to search for.
            top_k: Number of results to return; defaults to config top_k_retrieval.

        Returns:
            List of chunk dicts with text, source, page, chunk_index,
            and similarity_score.
        """
        resolved_top_k = top_k if top_k is not None else settings.top_k_retrieval
        query_vector: list[float] = self._embedder.embed_query(query)
        return self._store.search(query_vector, top_k=resolved_top_k)
