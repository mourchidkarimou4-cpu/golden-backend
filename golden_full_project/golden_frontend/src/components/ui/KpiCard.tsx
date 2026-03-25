// src/components/ui/KpiCard.tsx
import { useCountUp } from '@/hooks/useCountUp'
import { useState, useEffect, useRef } from 'react'

interface KpiCardProps {
  label: string
  value: number | string
  sub?: string
  trend?: string
  trendUp?: boolean
  icon?: string
  delay?: number
  prefix?: string
  suffix?: string
}

export function KpiCard({ label, value, sub, trend, trendUp, icon, delay = 0, prefix = '', suffix = '' }: KpiCardProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isNumber = typeof value === 'number'
  const count = useCountUp(isNumber ? value : 0, 1400, visible && isNumber)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={ref}
      className="kpi-card card-hover"
      style={{
        padding: '20px 22px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms, border-color .25s`,
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 28, height: 28,
            background: 'var(--dark-4)',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            fontSize: 12, color: 'var(--gold)',
          }}>{icon}</div>
        )}
      </div>

      <div style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: 34, fontWeight: 300,
        color: 'var(--text)', lineHeight: 1,
        marginBottom: 8,
      }}>
        {prefix}{isNumber ? count : value}{suffix}
      </div>

      {trend && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, padding: '2px 7px', borderRadius: 2,
          background: trendUp ? 'rgba(61,214,140,.08)' : 'rgba(255,255,255,.05)',
          color: trendUp ? '#3DD68C' : 'var(--text-muted)',
        }}>
          {trend}
        </span>
      )}
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>{sub}</div>
      )}
    </div>
  )
}
