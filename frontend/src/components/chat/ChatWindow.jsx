import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { InputBar } from "@/components/chat/InputBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * Chat overlay panel. Renders the message list and input bar.
 * @param {{ messages, isLoading, error, send, clearError, onClose }} props
 */
export function ChatWindow({ messages, isLoading, error, send, clearError, onClose }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="
            w-[90vw] max-w-sm h-[70vh] max-h-[520px]
            flex flex-col
            rounded-2xl overflow-hidden
            bg-zinc-900 border border-white/10
            shadow-2xl shadow-black/60
        ">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div>
                    <p className="font-head text-white text-sm font-semibold">Ask me anything</p>
                    <p className="font-body text-zinc-400 text-xs">Powered by RAG</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close chat"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 && (
                    <p className="font-body text-zinc-500 text-sm text-center mt-8">
                        Ask me about Jeffrey's experience, projects, or skills.
                    </p>
                )}
                {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex gap-1 px-1">
                        <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Error */}
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between">
                    <p className="font-body text-red-400 text-xs">{error}</p>
                    <button onClick={clearError} className="text-red-400 hover:text-red-300 text-xs ml-2 cursor-pointer">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Input */}
            <InputBar send={send} isLoading={isLoading} />
        </div>
    );
}
