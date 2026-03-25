// src/pages/investisseur/ProjetsPage.tsx
import { useState, useEffect } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SkeletonKpiGrid, EmptyState, ProjectCard } from '@/components/ui'
import { TrendingUp } from 'lucide-react'
import { projectsAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


const SECTORS = ['Tous', 'Agriculture', 'Tech', 'Énergie', 'Santé', 'Immobilier', 'Finance']

export default function ProjetsPage() {
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('Tous')
  const [search, setSearch] = useState('')

  useEffect(() => {
    projectsAPI.list?.({ status: 'published' })
      .then((r: any) => setProjects(r.data?.results ?? r.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const matchSector = sector === 'Tous' || p.sector === sector
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  })

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Projets" subtitle="Explorez les opportunités d'investissement">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>Accueil</a>
      </div>

      {/* Filtres */}
      <div style={{ marginBottom: 24 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          style={{
            width: '100%', padding: '10px 14px', marginBottom: 12,
            background: 'var(--dark-3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)} style={{
              padding: '6px 14px', fontSize: 10, letterSpacing: '.1em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              background: sector === s ? 'var(--gold)' : 'transparent',
              color: sector === s ? 'var(--dark)' : 'var(--text-muted)',
              border: `1px solid ${sector === s ? 'var(--gold)' : 'var(--border)'}`,
              transition: 'all .2s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonKpiGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="Aucun projet disponible"
          description="Aucun projet ne correspond à votre recherche pour le moment."
          action={{ label: 'Réinitialiser les filtres', onClick: () => { setSector('Tous'); setSearch('') } }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 16 }}>
          {filtered.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              onFav={() => setProjects(p => [...p])}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
