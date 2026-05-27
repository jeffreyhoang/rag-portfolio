import { useState, type KeyboardEvent } from 'react'

interface Props {
  onSend: (query: string) => void
  loading: boolean
}

export default function InputBar({ onSend, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSend() {
    if (!value.trim() || loading) return
    onSend(value)
    setValue('')
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem',
        borderTop: '1px solid var(--card-border)',
        background: 'var(--bg2)',
      }}
    >
      <input
        type="text"
        className="form-input"
        placeholder="Ask me anything..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={loading}
        style={{ flex: 1 }}
      />
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        style={{
          padding: '0 1rem',
          background: loading || !value.trim()
            ? 'rgba(59,130,246,0.2)'
            : 'linear-gradient(135deg, #3b82f6, #6366f1)',
          border: 'none',
          borderRadius: 8,
          color: '#fff',
          fontSize: '1rem',
          cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          minWidth: 44,
        }}
      >
        →
      </button>
    </div>
  )
}
