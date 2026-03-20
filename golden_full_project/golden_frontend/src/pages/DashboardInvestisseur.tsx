// src/pages/DashboardInvestisseur.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { KpiCard, StatusBadge, SectorBadge, ProgressBar, GoldenSpinner } from '@/components/ui'
import { investmentsAPI, projectsAPI, matchingAPI, reportingAPI } from '@/lib/api'
import ProjectCard from '@/components/dashboard/ProjectCard'
import InvestModal from '@/components/dashboard/InvestModal'

const NAV_ITEMS = [
  { icon: '◈', label: 'Explorer les projets', to: '/investisseur' },
  { icon: '◎', label: 'Mon portefeuille',     to: '/investisseur/portfolio' },
  { icon: '◫', label: 'Rapports',             to: '/investisseur/rapports' },
  { icon: '✉', label: 'Messages',             to: '/investisseur/messages', badge: 2 },
  { icon: '★', label: 'Favoris',              to: '/investisseur/favoris' },
  { icon: '◯', label: 'Mon profil',           to: '/investisseur/profil' },
  { icon: '⊙', label: 'Paramètres',          to: '/investisseur/parametres' },
]

const SECTOR_COLORS = ['#C9A84C','#E8C97A','#8B7535','#F5E9C8','#6B5A2A','#A08040']

export default function DashboardInvestisseur() {
  const [dashboard, setDashboard]       = useState<any>(null)
  const [recommendations, setRecos]     = useState<any[]>([])
  const [portfolio, setPortfolio]       = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [modalProject, setModalProject] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      reportingAPI.dashboardInvestor(),
      matchingAPI.recommendations(),
      investmentsAPI.list(),
    ]).then(([dash, recos, inv]) => {
      setDashboard(dash.data)
      setRecos(recos.data.results ?? [])
      setPortfolio(inv.data.results ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_ITEMS} title="Tableau de bord">
      <GoldenSpinner />
    </DashboardLayout>
  )

  const { summary, sector_breakdown = {}, recent_investments = [] } = dashboard ?? {}

  // Données donut chart
  const donutData = Object.entries(sector_breakdown).map(([name, value]) => ({
    name, value: Math.round(value as number / 1_000_000),
  }))

  const filters = ['Tous', 'Agriculture', 'Tech', 'Énergie', 'Santé', 'Immobilier']

  const filteredRecos = activeFilter === 'Tous'
    ? recommendations
    : recommendations.filter(p => p.sector_label?.includes(activeFilter))

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      title="Tableau de bord investisseur"
      subtitle={new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
      headerActions={
        <button
          className="btn-gold-sm"
          onClick={() => navigate('/investisseur')}
        >
          ⊕ Investir
        </button>
      }
    >

      {/* ── KPIs ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        <KpiCard
          label="Portefeuille total"
          value={`${((summary?.total_invested ?? 0) / 1_000_000).toFixed(0)}M ₣`}
          trend="↑ +8,4% YTD"
          trendUp
          icon="₣"
        />
        <KpiCard
          label="ROI moyen"
          value={`${summary?.average_roi ?? 0}%`}
          trend="↑ vs 14% marché"
          trendUp
          icon="%"
        />
        <KpiCard
          label="Projets actifs"
          value={summary?.active_investments ?? 0}
          sub={`${summary?.total_investments ?? 0} au total`}
          icon="◎"
        />
        <KpiCard
          label="Investissements"
          value={summary?.total_investments ?? 0}
          sub="Toutes durées"
          icon="◈"
        />
      </div>

      {/* ── Ligne : Donut + Projets recommandés ───── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 32 }}>

        {/* Donut répartition sectorielle */}
        <div className="kpi-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
            Répartition sectorielle
          </div>
          {donutData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--dark-3)', border: '1px solid var(--border)', fontSize: 11 }}
                    formatter={(v: number) => [`${v}M ₣`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                {donutData.slice(0, 4).map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <div style={{ width: 8, height: 8, background: SECTOR_COLORS[i], borderRadius: 1, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{d.name}</span>
                    <span style={{ color: 'var(--text)' }}>{d.value}M ₣</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
              Aucun investissement
            </p>
          )}
        </div>

        {/* Projets recommandés */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Projets recommandés
            </div>
            {/* Filtres */}
            <div style={{ display: 'flex', gap: 8 }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '3px 10px', fontSize: 10,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: '1px solid',
                    borderColor: activeFilter === f ? 'var(--gold)' : 'var(--border)',
                    background: activeFilter === f ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: activeFilter === f ? 'var(--gold)' : 'var(--text-muted)',
                    cursor: 'none', transition: 'all .2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {filteredRecos.length > 0 ? filteredRecos.slice(0, 4).map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                matchScore={p.match_score}
                onInvest={() => setModalProject(p)}
              />
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, gridColumn: '1/-1', padding: '24px 0' }}>
                Aucun projet recommandé pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Portefeuille ────────────────────────────── */}
      <div className="kpi-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
          Mon portefeuille
        </div>
        {recent_investments.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Projet', 'Secteur', 'Montant', 'ROI', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '8px 12px',
                    fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent_investments.map((inv: any) => (
                <tr key={inv.id} style={{ cursor: 'none', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--dark-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text)' }}>{inv.project_title}</td>
                  <td style={{ padding: '10px 12px' }}><SectorBadge sector={inv.sector?.toLowerCase()} label={inv.sector} /></td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--gold-light)' }}>
                    {(inv.amount / 1_000_000).toFixed(1)}M ₣
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#4ade80' }}>
                    {inv.roi_agreed ? `${inv.roi_agreed}%` : '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <StatusBadge status={inv.status} label={inv.status_label} />
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
            Aucun investissement pour le moment. Explorez les projets recommandés ci-dessus.
          </p>
        )}
      </div>

      {/* Modal investissement */}
      {modalProject && (
        <InvestModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          onSuccess={() => {
            setModalProject(null)
            window.location.reload()
          }}
        />
      )}

    </DashboardLayout>
  )
}
