from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str
    session_id: str


class SourceSchema(BaseModel):
    source: str
    page: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceSchema]
    session_id: str
    rewritten_query: str


class HealthResponse(BaseModel):
    status: str
    document_count: int
    rerank_model: str
    generation_model: str
