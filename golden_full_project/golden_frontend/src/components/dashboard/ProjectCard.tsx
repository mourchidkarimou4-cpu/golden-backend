// src/components/dashboard/ProjectCard.tsx
import { useState } from 'react'
import { SectorBadge, ProgressBar, StatusBadge } from '@/components/ui'
import { projectsAPI } from '@/lib/api'

interface ProjectCardProps {
  project:    any
  matchScore?: number
  onInvest?:  (project: any) => void
  showOwner?: boolean
}

export default function ProjectCard({ project, matchScore, onInvest, showOwner }: ProjectCardProps) {
  const [faved, setFaved] = useState(project.is_favorite ?? false)

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setFaved(!faved)
    await projectsAPI.toggleFav(project.id).catch(() => setFaved(faved))
  }

  const pct = project.funding_percentage ?? 0

  return (
    <div
      style={{
        background: 'var(--dark-3)',
        border: '1px solid var(--border)',
        padding: 20,
        cursor: 'none',
        transition: 'border-color .25s, transform .2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Top bar on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
        opacity: 0, transition: 'opacity .3s',
      }} className="card-top-bar" />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <SectorBadge sector={project.sector} label={project.sector_label ?? project.sector} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>📍 {project.country}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {matchScore !== undefined && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: '#4ade80', letterSpacing: '0.06em',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              Match {matchScore.toFixed(0)}%
            </div>
          )}
          <button
            onClick={toggleFav}
            style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'none',
              color: faved ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'color .2s',
            }}
          >{faved ? '♥' : '♡'}</button>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6,
        marginBottom: 16,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {project.tagline || project.description}
      </p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Recherché', value: `${(project.amount_needed / 1_000_000).toFixed(0)}M ₣` },
          { label: 'ROI estimé', value: `${project.roi_estimated}%` },
          { label: 'Durée',     value: `${project.duration_months} mois` },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 5 }}>
          <span>Progression</span>
          <span style={{ color: 'var(--gold)' }}>{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      {/* CTA */}
      {onInvest && (
        <button
          onClick={() => onInvest(project)}
          className="btn-gold-sm"
          style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
        >
          Investir →
        </button>
      )}
    </div>
  )
}
