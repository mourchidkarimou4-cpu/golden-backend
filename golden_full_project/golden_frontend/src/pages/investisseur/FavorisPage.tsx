// src/pages/investisseur/FavorisPage.tsx
import { useState, useEffect } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel, StatusBadge } from '@/components/ui'
import { projectsAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


export default function FavorisPage() {
  const isMobile = useIsMobile()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsAPI.favorites().then(({ data }) => {
      setFavorites(data.results ?? data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const handleRemoveFav = async (id: string) => {
    await projectsAPI.toggleFav(id)
    setFavorites(f => f.filter(p => p.id !== id))
  }

  if (loading) return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Favoris">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <GoldenSpinner />
    </DashboardLayout>
  )

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Favoris" subtitle="Vos projets sauvegardés">
      {favorites.length === 0 ? (
        <div className="kpi-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>♦</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
            Vous n'avez pas encore de projets en favoris.
          </p>
          <button className="btn-primary" onClick={() => window.location.href = '/investisseur/projets'}>
            Explorer les projets →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
          {favorites.map((p: any) => (
            <div key={p.id} className="kpi-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, fontWeight: 400, marginBottom: 6 }}>{p.title}</h3>
                  <StatusBadge status={p.status} label={p.status_label ?? p.status} />
                </div>
                <button onClick={() => handleRemoveFav(p.id)} style={{
                  background: 'none', border: 'none', color: 'var(--gold)',
                  fontSize: 20, cursor: 'pointer',
                }}>♦</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                {p.tagline ?? p.description?.slice(0, 100) + '...'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Montant', value: `${((p.amount_needed ?? 0)/1_000_000).toFixed(0)}M ₣` },
                  { label: 'ROI', value: `${p.roi_estimated ?? 0}%` },
                  { label: 'Durée', value: `${p.duration_months ?? 0}m` },
                ].map(s => (
                  <div key={s.label} style={{ padding: 10, background: 'var(--dark-4)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, color: 'var(--text)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: '100%', fontSize: 11, padding: '10px' }}
                onClick={() => window.location.href = `/investisseur/projets`}>
                Voir le projet →
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
