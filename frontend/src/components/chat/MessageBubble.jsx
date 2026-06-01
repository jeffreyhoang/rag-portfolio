import { CitationCard } from "@/components/chat/CitationCard";

/**
 * Renders a single chat message with optional source citations.
 * @param {{ message: { role: string, content: string, sources?: { source: string, page: number }[] } }} props
 */
export function MessageBubble({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <div
                className={`
                    max-w-[85%] px-3 py-2 rounded-2xl text-sm font-body leading-relaxed
                    ${isUser
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                    }
                `}
            >
                {message.content}
            </div>
            {message.sources && message.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 max-w-[85%]">
                    {message.sources.map((src, i) => (
                        <CitationCard key={i} source={src} />
                    ))}
                </div>
            )}
        </div>
    );
}
