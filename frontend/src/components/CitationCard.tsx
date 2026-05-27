import type { SourceSchema } from '../api/client'

interface Props {
  sources: SourceSchema[]
}

export default function CitationCard({ sources }: Props) {
  if (sources.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
      {sources.map((s, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            padding: '0.18rem 0.5rem',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 4,
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--blue2)',
          }}
        >
          {s.source} · p.{s.page}
        </span>
      ))}
    </div>
  )
}
