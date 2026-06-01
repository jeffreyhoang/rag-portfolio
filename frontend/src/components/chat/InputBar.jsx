import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

/**
 * Text input and send button for the chat window.
 * @param {{ send: (query: string) => void, isLoading: boolean }} props
 */
export function InputBar({ send, isLoading }) {
    const [query, setQuery] = useState("");

    const handleSubmit = () => {
        if (!query.trim() || isLoading) return;
        send(query.trim());
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2">
            <textarea
                rows={1}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                disabled={isLoading}
                className="
                    flex-1 resize-none bg-zinc-800 text-white text-sm font-body
                    placeholder-zinc-500 rounded-xl px-3 py-2
                    border border-white/10 focus:outline-none focus:border-indigo-500
                    disabled:opacity-50 transition-colors
                "
            />
            <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                className="
                    h-9 w-9 rounded-xl flex items-center justify-center
                    bg-indigo-600 text-white
                    hover:bg-indigo-500 disabled:opacity-40 cursor-pointer
                    transition-colors
                "
                aria-label="Send message"
            >
                <FontAwesomeIcon icon={faPaperPlane} size="sm" />
            </button>
        </div>
    );
}
