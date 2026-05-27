import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ChatWindow from './ChatWindow'

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 200 }}>
        {/* Tooltip */}
        {!open && (
          <div
            style={{
              position: 'absolute',
              bottom: '110%',
              right: 0,
              background: 'var(--bg2)',
              border: '1px solid var(--card-border)',
              borderRadius: 8,
              padding: '0.35rem 0.7rem',
              fontSize: '0.75rem',
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
            className="chat-tooltip"
          >
            Ask me anything
          </div>
        )}

        {/* AI badge */}
        <div
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            borderRadius: 999,
            padding: '0.15rem 0.4rem',
            fontSize: '0.6rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.05em',
            zIndex: 1,
          }}
        >
          AI
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          title="Ask me anything"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: open ? 'none' : 'pulse-glow 2.5s ease-in-out infinite',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
        >
          {open ? '✕' : '🤖'}
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && <ChatWindow onClose={() => setOpen(false)} />}
      </AnimatePresence>

      <style>{`
        button:hover .chat-tooltip { opacity: 1; }
      `}</style>
    </>
  )
}
