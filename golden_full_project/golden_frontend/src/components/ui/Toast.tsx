// src/components/ui/Toast.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const COLORS = {
  success: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.3)', color: '#4ade80' },
  error:   { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', color: '#f87171' },
  warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24' },
  info:    { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)', color: '#60a5fa' },
}

type ToastFn = (message: string, duration?: number) => void
interface ToastAPI { success: ToastFn; error: ToastFn; warning: ToastFn; info: ToastFn }

let _addToast: ((t: Omit<Toast, 'id'>) => void) | null = null

export const toast: ToastAPI = {
  success: (m, d) => _addToast?.({ type: 'success', message: m, duration: d }),
  error:   (m, d) => _addToast?.({ type: 'error',   message: m, duration: d }),
  warning: (m, d) => _addToast?.({ type: 'warning', message: m, duration: d }),
  info:    (m, d) => _addToast?.({ type: 'info',    message: m, duration: d }),
}

function ToastItem({ t, onRemove }: { t: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const duration = t.duration ?? 3500
  const Icon = ICONS[t.type]
  const colors = COLORS[t.type]
  const startRef = useRef<number>(Date.now())
  const rafRef = useRef<number>()

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct > 0) rafRef.current = requestAnimationFrame(tick)
      else { setVisible(false); setTimeout(() => onRemove(t.id), 300) }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 16px",
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      backdropFilter: "blur(12px)",
      minWidth: 280, maxWidth: 380,
      transform: visible ? "translateX(0)" : "translateX(120%)",
      opacity: visible ? 1 : 0,
      transition: "transform .3s ease, opacity .3s ease",
      position: "relative", overflow: "hidden",
    }}>
      <Icon size={16} strokeWidth={1.5} color={colors.color} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13, color: "var(--text)", flex: 1, lineHeight: 1.5 }}>{t.message}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onRemove(t.id), 300) }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, flexShrink: 0 }}>
        <X size={14} strokeWidth={1.5} />
      </button>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, background: colors.color, opacity: 0.5,
        width: `${progress}%`, transition: "width .1s linear",
      }} />
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
  }, [])

  useEffect(() => { _addToast = addToast; return () => { _addToast = null } }, [addToast])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      display: "flex", flexDirection: "column", gap: 10,
      zIndex: 9999, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <ToastItem t={t} onRemove={remove} />
        </div>
      ))}
    </div>
  )
}
