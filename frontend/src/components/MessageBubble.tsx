import type { Message } from '../hooks/useChat'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: '0.35rem',
        marginBottom: '0.75rem',
      }}
    >
      {/* Rewritten query hint for assistant messages */}
      {!isUser && message.rewrittenQuery && (
        <p
          style={{
            fontSize: '0.7rem',
            fontStyle: 'italic',
            color: 'var(--muted)',
            paddingLeft: '0.25rem',
          }}
        >
          Searched for: {message.rewrittenQuery}
        </p>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: '82%',
          padding: '0.65rem 0.9rem',
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
            : 'var(--card)',
          border: isUser ? 'none' : '1px solid var(--card-border)',
          color: 'var(--text)',
          fontSize: '0.88rem',
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {/* Citation pills */}
      {!isUser && message.sources && message.sources.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingLeft: '0.25rem' }}>
          {message.sources.map((s, i) => (
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
      )}
    </div>
  )
}
