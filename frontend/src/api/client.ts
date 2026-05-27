const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ChatRequest {
  query: string
  session_id: string
}

export interface SourceSchema {
  source: string
  page: number
}

export interface ChatResponse {
  answer: string
  sources: SourceSchema[]
  session_id: string
  rewritten_query: string
}

export interface HealthResponse {
  status: string
  document_count: number
  rerank_model: string
  generation_model: string
}

export async function sendChat(query: string, session_id: string): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, session_id } satisfies ChatRequest),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<ChatResponse>
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/api/health`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<HealthResponse>
}
