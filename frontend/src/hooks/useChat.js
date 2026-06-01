import { useState, useCallback, useRef } from "react";
import { sendMessage } from "../api/client";

/**
 * Manages all chat state and communication with the RAG backend.
 * @returns {{ messages, isLoading, error, send, clearError }}
 */
export function useChat() {
    const sessionId = useRef(crypto.randomUUID());
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async (query) => {
        if (!query.trim()) return;

        setError(null);
        setMessages((prev) => [...prev, { role: "user", content: query }]);
        setIsLoading(true);

        try {
            const data = await sendMessage(query, sessionId.current);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer, sources: data.sources },
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { messages, isLoading, error, send, clearError };
}
