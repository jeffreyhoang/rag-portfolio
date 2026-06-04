from typing import Any

import chromadb
from loguru import logger
from pinecone import Pinecone, ServerlessSpec

from backend.config import settings
from backend.services.embedder import Embedder


class ChromaVectorStore:
    """ChromaDB-backed vector store — used in local development."""

    def __init__(self) -> None:
        """Initialize the ChromaDB client and collection from config."""
        self._client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self._collection = self._client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def add(self, chunks: list[dict[str, Any]]) -> None:
        """Store embedded chunks in ChromaDB."""
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
            logger.info(f"Upserted {len(chunks)} chunk(s) into ChromaDB collection '{settings.chroma_collection_name}'")
        except Exception as exc:
            logger.error(f"ChromaDB add failed: {exc}")
            raise RuntimeError(f"Failed to add chunks to vector store: {exc}") from exc

    def search(self, query_embedding: list[float], top_k: int | None = None) -> list[dict[str, Any]]:
        """Query ChromaDB for the most similar chunks."""
        resolved_top_k = top_k if top_k is not None else settings.top_k_retrieval
        try:
            results = self._collection.query(
                query_embeddings=[query_embedding],
                n_results=resolved_top_k,
                include=["documents", "metadatas", "distances"],
            )
            output: list[dict[str, Any]] = []
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            ):
                output.append({
                    "text": doc,
                    "source": meta["source"],
                    "page": meta["page"],
                    "chunk_index": meta["chunk_index"],
                    "similarity_score": 1.0 - dist,
                })
            logger.info(f"Retrieved {len(output)} result(s) from ChromaDB")
            return output
        except Exception as exc:
            logger.error(f"ChromaDB search failed: {exc}")
            raise RuntimeError(f"Failed to search vector store: {exc}") from exc

    def count(self) -> int:
        """Return the total number of documents in the collection."""
        return self._collection.count()


class PineconeVectorStore:
    """Pinecone-backed vector store — used in production."""

    def __init__(self) -> None:
        """Initialize Pinecone client and connect to the configured index."""
        pc = Pinecone(api_key=settings.pinecone_api_key)
        if settings.pinecone_index_name not in pc.list_indexes().names():
            pc.create_index(
                name=settings.pinecone_index_name,
                dimension=1536,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
        self._index = pc.Index(settings.pinecone_index_name)

    def add(self, chunks: list[dict[str, Any]]) -> None:
        """Store embedded chunks in Pinecone."""
        try:
            vectors = [
                {
                    "id": f"{c['source']}__p{c['page']}__c{c['chunk_index']}",
                    "values": c["embedding"],
                    "metadata": {
                        "text": c["text"],
                        "source": c["source"],
                        "page": c["page"],
                        "chunk_index": c["chunk_index"],
                    },
                }
                for c in chunks
            ]
            self._index.upsert(vectors=vectors)
            logger.info(f"Upserted {len(chunks)} chunk(s) into Pinecone index '{settings.pinecone_index_name}'")
        except Exception as exc:
            logger.error(f"Pinecone add failed: {exc}")
            raise RuntimeError(f"Failed to add chunks to Pinecone: {exc}") from exc

    def search(self, query_embedding: list[float], top_k: int | None = None) -> list[dict[str, Any]]:
        """Query Pinecone for the most similar chunks."""
        resolved_top_k = top_k if top_k is not None else settings.top_k_retrieval
        try:
            results = self._index.query(
                vector=query_embedding,
                top_k=resolved_top_k,
                include_metadata=True,
            )
            output: list[dict[str, Any]] = []
            for match in results["matches"]:
                meta = match["metadata"]
                output.append({
                    "text": meta["text"],
                    "source": meta["source"],
                    "page": int(meta["page"]),
                    "chunk_index": int(meta["chunk_index"]),
                    "similarity_score": match["score"],
                })
            logger.info(f"Retrieved {len(output)} result(s) from Pinecone")
            return output
        except Exception as exc:
            logger.error(f"Pinecone search failed: {exc}")
            raise RuntimeError(f"Failed to search Pinecone: {exc}") from exc

    def count(self) -> int:
        """Return the total number of vectors in the Pinecone index."""
        stats = self._index.describe_index_stats()
        return stats["total_vector_count"]


def VectorStore() -> ChromaVectorStore | PineconeVectorStore:
    """Return Pinecone if credentials are configured, else ChromaDB."""
    if settings.pinecone_api_key and settings.pinecone_index_name:
        logger.info("Using Pinecone vector store")
        return PineconeVectorStore()
    logger.info("Using ChromaDB vector store")
    return ChromaVectorStore()


class Retriever:
    """Single entry point for query-time retrieval over the vector store."""

    def __init__(self, vector_store: ChromaVectorStore | PineconeVectorStore, embedder: Embedder) -> None:
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
