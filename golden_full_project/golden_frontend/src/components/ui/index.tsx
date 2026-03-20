// src/components/ui/index.tsx
// Composants UI réutilisables GOLDEN

import { useEffect, useRef, ReactNode } from 'react'
import { clsx } from 'clsx'

// ── Curseur personnalisé ───────────────────────────────────
export function GoldenCursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  let rx = 0, ry = 0

  useEffect(() => {
    let mx = 0, my = 0
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      if (dot.current) {
        dot.current.style.left = `${mx}px`
        dot.current.style.top  = `${my}px`
      }
      if (ring.current) {
        rx += (mx - rx) * 0.12
        ry += (my - ry) * 0.12
        ring.current.style.left = `${rx}px`
        ring.current.style.top  = `${ry}px`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={dot}  className="cursor-dot"  style={{
        position:'fixed', top:0, left:0, zIndex:9999, pointerEvents:'none',
        width:8, height:8, background:'var(--gold)', borderRadius:'50%',
        transform:'translate(-50%,-50%)', transition:'width .3s,height .3s',
      }}/>
      <div ref={ring} className="cursor-ring" style={{
        position:'fixed', top:0, left:0, zIndex:9998, pointerEvents:'none',
        width:36, height:36, border:'1px solid rgba(201,168,76,0.5)', borderRadius:'50%',
        transform:'translate(-50%,-50%)', transition:'width .3s,height .3s',
      }}/>
    </>
  )
}

// ── Logo GOLDEN ───────────────────────────────────────────
export function GoldenLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 28, md: 38, lg: 50 }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-3">
      <div style={{
        width: s, height: s,
        border: '1px solid var(--gold)',
        display: 'grid', placeItems: 'center',
        transform: 'rotate(45deg)',
        position: 'relative',
      }}>
        <span style={{
          transform: 'rotate(-45deg)',
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: s * 0.47,
          fontWeight: 600,
          color: 'var(--gold)',
          lineHeight: 1,
        }}>G</span>
      </div>
      <span style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: size === 'sm' ? 16 : size === 'md' ? 20 : 28,
        fontWeight: 600,
        letterSpacing: '0.12em',
        color: 'var(--text)',
        textTransform: 'uppercase',
      }}>
        GOLDEN <span style={{ color: 'var(--gold)' }}>Invest</span>
      </span>
    </div>
  )
}

// ── Section Label ─────────────────────────────────────────
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="section-label">
      <div className="section-label-line" />
      <span className="section-label-text">{children}</span>
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────
interface KpiCardProps {
  label:    string
  value:    string | number
  sub?:     string
  trend?:   string
  trendUp?: boolean
  icon?:    string
}

export function KpiCard({ label, value, sub, trend, trendUp, icon }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 28, height: 28,
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            fontSize: 13, color: 'var(--gold)',
          }}>{icon}</div>
        )}
      </div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 36, fontWeight: 300, lineHeight: 1, color: 'var(--gold-light)' }}>
        {value}
      </div>
      {trend && (
        <span style={{ fontSize: 11, color: trendUp ? '#4ade80' : 'var(--text-muted)', marginTop: 6, display: 'block' }}>
          {trend}
        </span>
      )}
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  )
}

// ── Gold Divider ──────────────────────────────────────────
export function GoldDivider() {
  return <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />
}

// ── Loading spinner ───────────────────────────────────────
export function GoldenSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{
        width: 36, height: 36,
        border: '1px solid var(--border)',
        borderTop: '1px solid var(--gold)',
        borderRadius: '50%',
        animation: 'rotate 1s linear infinite',
      }} />
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  active:        'rgba(74,222,128,0.15)',
  funded:        'rgba(201,168,76,0.2)',
  pending_review:'rgba(251,191,36,0.15)',
  draft:         'rgba(100,100,100,0.2)',
  closed:        'rgba(239,68,68,0.15)',
  rejected:      'rgba(239,68,68,0.15)',
}
const STATUS_TEXT: Record<string, string> = {
  active:        '#4ade80',
  funded:        'var(--gold)',
  pending_review:'#fbbf24',
  draft:         'var(--text-muted)',
  closed:        '#f87171',
  rejected:      '#f87171',
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: STATUS_COLORS[status] || 'rgba(100,100,100,0.2)',
      color: STATUS_TEXT[status] || 'var(--text-muted)',
      border: `1px solid ${STATUS_TEXT[status] || 'var(--border)'}`,
    }}>
      {label}
    </span>
  )
}

// ── Sector Badge ──────────────────────────────────────────
const SECTOR_COLORS: Record<string, string> = {
  agro:        'rgba(74,222,128,0.15)',
  tech:        'rgba(96,165,250,0.15)',
  energy:      'rgba(251,191,36,0.15)',
  health:      'rgba(248,113,113,0.15)',
  education:   'rgba(167,139,250,0.15)',
  real_estate: 'rgba(201,168,76,0.15)',
}

export function SectorBadge({ sector, label }: { sector: string; label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      fontSize: 10,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      background: SECTOR_COLORS[sector] || 'rgba(100,100,100,0.1)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
    }}>
      {label}
    </span>
  )
}

// ── Progress Bar ──────────────────────────────────────────
export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ width: '100%', height: 3, background: 'var(--dark-4)', borderRadius: 2 }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: `linear-gradient(to right, var(--gold), var(--gold-light))`,
        borderRadius: 2,
        transition: 'width 0.8s ease',
      }} />
    </div>
  )
}

// ── cn helper ─────────────────────────────────────────────
export function cn(...args: (string | undefined | null | false)[]) {
  return clsx(args)
}
