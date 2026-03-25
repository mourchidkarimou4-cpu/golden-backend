// src/pages/SharePage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GoldenLogo, GoldenSpinner } from '@/components/ui'
import { projectsAPI } from '@/lib/api'
import { TrendingUp, Clock, MapPin, BarChart2, ArrowRight } from 'lucide-react'

export default function SharePage() {
  const { token } = useParams<{ token: string }>()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    projectsAPI.getByShareToken(token)
      .then(({ data }) => setProject(data))
      .catch(() => setError('Ce lien est invalide ou a expiré.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
      <GoldenSpinner />
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <GoldenLogo size="lg" />
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontFamily: '"Cormorant Garamond", serif', color: 'var(--text-muted)', opacity: 0.4 }}>404</div>
        <h1 style={{ fontSize: 20, fontWeight: 400, color: 'var(--text)', marginTop: 12 }}>{error}</h1>
        <Link to="/" style={{ display: 'inline-block', marginTop: 24, color: 'var(--gold)', fontSize: 13 }}>← Retour à l'accueil</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Header */}
      <nav style={{
        padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)', background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <GoldenLogo />
        <Link to="/register" style={{
          padding: '8px 20px', background: 'var(--gold)', color: 'var(--dark)',
          textDecoration: 'none', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          Rejoindre GOLDEN <ArrowRight size={12} />
        </Link>
      </nav>

      {/* Contenu */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        {/* Badge secteur */}
        <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          {project.sector}
        </div>

        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 42, fontWeight: 300, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
          {project.title}
        </h1>

        {project.tagline && (
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>{project.tagline}</p>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Objectif', value: `${(parseFloat(project.amount_needed)/1_000_000).toFixed(0)}M FCFA`, Icon: TrendingUp },
            { label: 'ROI estimé', value: `${project.roi_estimated}%`, Icon: BarChart2 },
            { label: 'Durée', value: `${project.duration_months} mois`, Icon: Clock },
            { label: 'Localisation', value: `${project.city || ''} ${project.country}`.trim(), Icon: MapPin },
          ].map(s => (
            <div key={s.label} className="kpi-card" style={{ padding: 20 }}>
              <s.Icon size={14} strokeWidth={1.5} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progression */}
        <div className="kpi-card" style={{ padding: 28, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progression du financement</span>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{project.funding_percentage}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--dark-4)', borderRadius: 2 }}>
            <div style={{ width: `${Math.min(100, project.funding_percentage)}%`, height: '100%', background: 'var(--gold)', borderRadius: 2, transition: 'width 1s ease' }} />
          </div>
        </div>

        {/* Description */}
        <div className="kpi-card" style={{ padding: 28, marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 16 }}>Description</div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8 }}>{project.description}</p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px solid var(--border)', background: 'var(--dark-2)' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: 'var(--text)', marginBottom: 12 }}>
            Intéressé par ce projet ?
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
            Rejoignez GOLDEN pour investir dans ce projet et découvrir d'autres opportunités en Afrique.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 36px', background: 'var(--gold)', color: 'var(--dark)',
            textDecoration: 'none', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase',
          }}>
            Créer un compte <ArrowRight size={14} />
          </Link>
        </div>

        {/* Expiration */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', marginTop: 24 }}>
          Ce lien est valable jusqu'au {new Date(project.expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
