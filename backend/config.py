from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openai_api_key: str
    pinecone_api_key: str = ""
    pinecone_index_name: str = ""
    chroma_persist_dir: str = str(_BACKEND_DIR / "chroma_db")
    chroma_collection_name: str = "portfolio"
    embedding_model: str = "text-embedding-3-small"
    generation_model: str = "gpt-4o-mini"
    chunk_size: int = 512
    chunk_overlap: int = 50
    top_k_retrieval: int = 10
    top_k_rerank: int = 3
    rerank_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    memory_window_size: int = 10
    embedding_batch_size: int = 100
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
