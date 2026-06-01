const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * Send a chat message to the RAG backend.
 * @param {string} query - The user's message.
 * @param {string} sessionId - UUID identifying the conversation session.
 * @returns {Promise<{ answer: string, sources: { source: string, page: number }[], rewritten_query: string }>}
 */
export async function sendMessage(query, sessionId) {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail ?? `Request failed with status ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch backend health status and vector store info.
 * @returns {Promise<{ status: string, document_count: number, rerank_model: string, generation_model: string }>}
 */
export async function fetchHealth() {
    const response = await fetch(`${API_URL}/api/health`);

    if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
    }

    return response.json();
}