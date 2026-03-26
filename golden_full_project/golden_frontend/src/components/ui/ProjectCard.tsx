// src/components/ui/ProjectCard.tsx
import { TrendingUp, Clock, MapPin, Heart } from 'lucide-react'
import { projectsAPI } from '@/lib/api'

const SECTOR_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  agro:        { bg: '#1a2e1a', color: '#4ade80', label: 'Agro-industrie' },
  tech:        { bg: '#1a1f2e', color: '#60a5fa', label: 'Technologie' },
  energy:      { bg: '#2e2a1a', color: '#fbbf24', label: 'Energie' },
  health:      { bg: '#2e1a1a', color: '#f87171', label: 'Sante' },
  education:   { bg: '#1a2a2e', color: '#34d399', label: 'Education' },
  real_estate: { bg: '#2e1f1a', color: '#fb923c', label: 'Immobilier' },
  transport:   { bg: '#1e1a2e', color: '#a78bfa', label: 'Transport' },
  finance:     { bg: '#1a2e2a', color: '#B87333', label: 'Finance' },
  default:     { bg: '#1a1a2e', color: '#94a3b8', label: 'Autre' },
}

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
        <circle cx="22" cy="22" r={r} fill="none"
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
      }}>{score}%</div>
    </div>
  )
}

export function ProjectCard({ project, onFav, onClick }: ProjectCardProps) {
  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await projectsAPI.toggleFav(project.id)
    onFav?.()
  }

  const sectorTheme = SECTOR_COLORS[project.sector] ?? SECTOR_COLORS.default

  return (
    <div onClick={onClick} style={{
      border: '1px solid var(--border)',
      background: 'var(--dark-2)', cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color .2s', overflow: 'hidden',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {/* Cover */}
      {project.cover_image ? (
        <div style={{ height: 80, overflow: 'hidden', position: 'relative' }}>
          <img src={project.cover_image} alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {project.matching_score != null && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <MatchScoreRing score={project.matching_score} />
            </div>
          )}
        </div>
      ) : (
        <div style={{
          height: 80, background: sectorTheme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, ${sectorTheme.color}22 0%, transparent 70%)`,
          }} />
          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase',
            color: sectorTheme.color, opacity: 0.8,
          }}>{sectorTheme.label}</span>
          {project.matching_score != null && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <MatchScoreRing score={project.matching_score} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            {project.sector}
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 20, color: 'var(--text)', lineHeight: 1.2 }}>
            {project.title}
          </div>
        </div>

        {project.tagline && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
            {project.tagline}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { Icon: TrendingUp, label: 'Objectif', val: `${(parseFloat(String(project.funding_goal ?? project.amount_needed ?? 0))/1_000_000).toFixed(0)}M` },
            { Icon: Clock,      label: 'ROI',      val: `${project.expected_roi ?? project.roi_estimated ?? '--'}%` },
            { Icon: MapPin,     label: 'Duree',    val: `${project.duration_months ?? '--'}m` },
          ].map(s => (
            <div key={s.label}>
              <s.Icon size={11} strokeWidth={1.5} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
              <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: 'var(--text)' }}>{s.val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleFav} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--text-muted)',
            fontSize: 10, cursor: 'pointer', letterSpacing: '.08em',
          }}>
            <Heart size={12} strokeWidth={1.5} /> Favori
          </button>
          <button onClick={onClick} style={{
            flex: 1, padding: '8px', background: 'var(--gold)', color: 'var(--dark)',
            border: 'none', fontSize: 10, cursor: 'pointer',
            letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'inherit',
          }}>
            Voir le projet
          </button>
        </div>
      </div>
    </div>
  )
}
