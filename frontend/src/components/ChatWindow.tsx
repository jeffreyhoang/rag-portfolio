import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'

const SUGGESTIONS = [
  'What are his technical skills?',
  'Tell me about his projects',
  'What is his educational background?',
  'Is he open to new opportunities?',
]

interface Props {
  onClose: () => void
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '0.65rem 0.9rem', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--blue2)',
            animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function ChatWindow({ onClose }: Props) {
  const { messages, loading, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 32,
        width: 'min(380px, calc(100vw - 2rem))',
        height: 560,
        background: 'var(--bg2)',
        border: '1px solid rgba(99,179,255,0.2)',
        borderRadius: 16,
        boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,179,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 200,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🤖</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
              Jeffrey's AI Assistant
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 4px #22c55e',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem',
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Welcome message */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: '14px 14px 14px 4px',
            padding: '0.65rem 0.9rem',
            fontSize: '0.88rem',
            color: 'var(--text)',
            lineHeight: 1.65,
            marginBottom: '0.75rem',
          }}
        >
          Hi! I'm Jeffrey's AI assistant. Ask me anything about his experience, projects, skills, or
          background.
        </div>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                style={{
                  textAlign: 'left',
                  background: 'rgba(59,130,246,0.07)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 8,
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--blue2)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.14)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.07)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Conversation */}
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {/* Loading indicator */}
        {loading && <LoadingDots />}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <InputBar onSend={sendMessage} loading={loading} />
    </motion.div>
  )
}
