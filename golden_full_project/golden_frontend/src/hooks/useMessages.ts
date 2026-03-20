// src/hooks/useMessages.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { messagingAPI } from '@/lib/api'

export function useThreads() {
  const [threads, setThreads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const { data } = await messagingAPI.threads()
      setThreads(data.results ?? data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  // Polling toutes les 30 secondes (WebSocket en Phase 2)
  useEffect(() => {
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [fetch])

  return { threads, loading, refetch: fetch }
}

export function useMessages(threadId: string | null) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading,  setLoading]  = useState(false)
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetch = useCallback(async () => {
    if (!threadId) return
    setLoading(true)
    try {
      const { data } = await messagingAPI.messages(threadId)
      setMessages(data.results ?? data)
    } finally {
      setLoading(false)
    }
  }, [threadId])

  useEffect(() => { fetch() }, [fetch])

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Polling toutes les 10 secondes quand un thread est ouvert
  useEffect(() => {
    if (!threadId) return
    const interval = setInterval(fetch, 10_000)
    return () => clearInterval(interval)
  }, [threadId, fetch])

  const sendMessage = async (body: string) => {
    if (!threadId || !body.trim()) return
    setSending(true)
    try {
      const { data } = await messagingAPI.send(threadId, body)
      setMessages(prev => [...prev, data])
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, sending, sendMessage, bottomRef, refetch: fetch }
}
