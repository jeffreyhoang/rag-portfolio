/**
 * Displays a single source citation as a small pill.
 * @param {{ source: { source: string, page: number } }} props
 */
export function CitationCard({ source }) {
    const filename = source.source.split("/").pop();

    return (
        <span className="
            inline-flex items-center gap-1
            px-2 py-0.5 rounded-full
            bg-zinc-700 text-zinc-300
            text-xs font-body
        ">
            <span className="text-indigo-400">↗</span>
            {filename}
            {source.page > 0 && <span className="text-zinc-500">p.{source.page}</span>}
        </span>
    );
}
