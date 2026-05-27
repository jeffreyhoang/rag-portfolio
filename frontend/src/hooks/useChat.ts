import { useState } from 'react'
import { sendChat } from '../api/client'
import type { SourceSchema } from '../api/client'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SourceSchema[]
  rewrittenQuery?: string
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState<string>(generateId)

  async function sendMessage(query: string): Promise<void> {
    const trimmed = query.trim()
    if (!trimmed) return

    const userMsg: Message = { id: generateId(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await sendChat(trimmed, sessionId)
      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
        rewrittenQuery: res.rewritten_query,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, sendMessage }
}
