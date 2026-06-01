import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

/** Floating chat button that mounts and orchestrates the chat window. */
export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, isLoading, error, send, clearError } = useChat();
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    send={send}
                    clearError={clearError}
                    onClose={() => setIsOpen(false)}
                />
            )}
            <div className={`relative transition-all duration-300 ${isOpen ? "opacity-0 scale-75 pointer-events-none h-0 overflow-hidden" : "opacity-100 scale-100"}`}>
                {/* Pulse ring */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping" />
                )}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="
                        relative h-14 w-14 rounded-full
                        bg-zinc-900 border border-white/20
                        text-indigo-400 shadow-lg shadow-black/40
                        flex items-center justify-center
                        cursor-pointer hover:scale-110 hover:rotate-12 hover:text-white hover:border-indigo-400/60
                        active:scale-95 transition-all duration-200
                    "
                    aria-label="Open chat"
                >
                    <FontAwesomeIcon icon={faRobot} size="lg" />
                </button>
            </div>
        </div>
    );
}
