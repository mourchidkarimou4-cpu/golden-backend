// src/pages/ProjectsPublicPage.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { projectsAPI } from '@/lib/api'

const SECTORS = ['Tous', 'Agriculture', 'Tech', 'Énergie', 'Santé', 'Immobilier', 'Finance']

export default function ProjectsPublicPage() {
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector]   = useState('Tous')
  const [search, setSearch]   = useState('')
  const [minRoi, setMinRoi]   = useState(0)
  const [maxAmount, setMaxAmount] = useState(1000)
  const [risk, setRisk]       = useState('Tous')
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    projectsAPI.list?.({})
      .then((r: any) => setProjects(r.data?.results ?? r.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const matchSector = sector === 'Tous' || p.sector === sector
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase())
    const matchRoi = (p.expected_roi ?? p.roi_estimated ?? 0) >= minRoi
    const matchAmount = (parseFloat(String(p.funding_goal ?? p.amount_needed ?? 0))/1_000_000) <= maxAmount
    const matchRisk = risk === 'Tous' || p.risk_level === risk
    return matchSector && matchSearch && matchRoi && matchAmount && matchRisk
  })

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? '10px 16px' : '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: isMobile ? 52 : 64,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}><GoldenLogo size={isMobile ? 'sm' : 'md'} /></Link>
        <div style={{ display: 'flex', gap: isMobile ? 10 : 16, alignItems: 'center' }}>
          {!isMobile && (
            <Link to="/" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase' }}>← Accueil</Link>
          )}
          <Link to="/login" style={{ fontSize: isMobile ? 10 : 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase' }}>Connexion</Link>
          <Link to="/register" style={{
            padding: isMobile ? '5px 10px' : '8px 20px',
            border: '1px solid var(--gold)',
            color: 'var(--gold)', textDecoration: 'none',
            fontSize: isMobile ? 10 : 11, letterSpacing: '.1em', textTransform: 'uppercase',
          }}>{isMobile ? 'Rejoindre' : 'Rejoindre →'}</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: isMobile ? '100px 24px 40px' : '120px 60px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>Opportunités d'investissement</span>
        </div>
        <h1 style={{
          fontFamily: '"Cormorant Garamond",serif',
          fontSize: isMobile ? 36 : 64, fontWeight: 300, lineHeight: 1.1, marginBottom: 16,
        }}>
          Projets <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>disponibles</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.8, marginBottom: 40 }}>
          Découvrez les meilleures opportunités d'investissement en Afrique. Tous les projets sont vérifiés par notre équipe.
        </p>

        {/* Recherche */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 12, marginBottom: 20, maxWidth: 600 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            style={{
              padding: '12px 16px', background: 'var(--dark-2)',
              border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 13, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <Link to="/register" style={{
            padding: '12px 24px', background: 'var(--gold)', color: 'var(--dark)',
            textDecoration: 'none', fontSize: 11, letterSpacing: '.1em',
            textTransform: 'uppercase', fontWeight: 500, display: 'flex',
            alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap',
          }}>Investir →</Link>
        </div>

        {/* Filtres secteurs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{
              padding: '6px 16px', fontSize: 10, letterSpacing: '.1em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              background: sector === s ? 'var(--gold)' : 'transparent',
              color: sector === s ? 'var(--dark)' : 'var(--text-muted)',
              border: `1px solid ${sector === s ? 'var(--gold)' : 'var(--border)'}`,
              transition: 'all .2s',
            }}>{s}</button>
          ))}
        </div>

        {/* Projets */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            Chargement des projets...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            border: '1px solid var(--border)', color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>◈</div>
            <p style={{ fontSize: 14, marginBottom: 20 }}>Aucun projet disponible pour le moment.</p>
            <Link to="/register?role=porteur" style={{
              padding: '10px 24px', background: 'var(--gold)', color: 'var(--dark)',
              textDecoration: 'none', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
            }}>Soumettre un projet →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {filtered.map((project: any) => (
              <div key={project.id} style={{
                border: '1px solid var(--border)', background: 'var(--dark-2)',
                overflow: 'hidden', transition: 'border-color .2s',
                position: 'relative',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor='var(--border-bright)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='var(--border)'}
              >
                {/* Top accent */}
                <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {project.sector} · {project.country ?? 'Afrique'}
                  </div>
                  <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 22, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
                    {project.title}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                    {project.tagline ?? project.description?.slice(0, 100) ?? 'Projet en cours de présentation.'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                    {[
                      { label: 'Objectif', val: `${(parseFloat(String(project.funding_goal ?? 0))/1000000).toFixed(0)}M ₣` },
                      { label: 'ROI', val: `${project.expected_roi ?? '--'}%` },
                      { label: 'Durée', val: `${project.duration_months ?? '--'}m` },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center', padding: '8px', background: 'var(--dark-3)', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: 'var(--text)' }}>{s.val}</div>
                        <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/register?role=investisseur" style={{
                    display: 'block', textAlign: 'center', padding: '10px',
                    background: 'var(--gold)', color: 'var(--dark)',
                    textDecoration: 'none', fontSize: 10, letterSpacing: '.12em',
                    textTransform: 'uppercase', fontWeight: 500,
                  }}>Investir dans ce projet →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer mini */}
      <div style={{ padding: '20px 60px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>© 2026 GOLDEN Investissement</div>
        <Link to="/" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>Retour à l'accueil</Link>
      </div>
    </div>
  )
}
