// src/components/ui/ProjectCard.tsx
import { TrendingUp, Clock, MapPin, Heart } from 'lucide-react'
import { projectsAPI } from '@/lib/api'

interface ProjectCardProps {
  project: any
  onFav?: () => void
  onClick?: () => void
}

function MatchScoreRing({ score }: { score: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--dark-4)" strokeWidth="3" />
        <circle
          cx="22" cy="22" r={r} fill="none"
          stroke={score >= 80 ? '#4ade80' : score >= 60 ? 'var(--gold)' : 'var(--text-muted)'}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 500, color: 'var(--text)',
      }}>
        {score}%
      </div>
    </div>
  )
}

export function ProjectCard({ project, onFav, onClick }: ProjectCardProps) {
  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await projectsAPI.toggleFav(project.id)
    onFav?.()
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: 20, border: '1px solid var(--border)',
        background: 'var(--dark-2)', cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color .2s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            {project.sector}
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 20, color: 'var(--text)', lineHeight: 1.2 }}>
            {project.title}
          </div>
        </div>
        {project.matching_score != null && (
          <MatchScoreRing score={project.matching_score} />
        )}
      </div>

      {/* Tagline */}
      {project.tagline && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
          {project.tagline}
        </p>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { Icon: TrendingUp, label: 'Objectif',   val: `${(parseFloat(String(project.funding_goal ?? project.amount_needed ?? 0))/1_000_000).toFixed(0)}M ₣` },
          { Icon: Clock,      label: 'ROI estimé', val: `${project.expected_roi ?? project.roi_estimated ?? '--'}%` },
          { Icon: MapPin,     label: 'Durée',      val: `${project.duration_months ?? '--'}m` },
        ].map(s => (
          <div key={s.label}>
            <s.Icon size={11} strokeWidth={1.5} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
            <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: 'var(--text)' }}>{s.val}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleFav}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--text-muted)',
            fontSize: 10, cursor: 'pointer', letterSpacing: '.08em',
          }}
        >
          <Heart size={12} strokeWidth={1.5} /> Favori
        </button>
        <button
          onClick={onClick}
          style={{
            flex: 1, padding: '8px', background: 'var(--gold)', color: 'var(--dark)',
            border: 'none', fontSize: 10, cursor: 'pointer',
            letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'inherit',
          }}
        >
          Voir le projet →
        </button>
      </div>
    </div>
  )
}
