// src/pages/DashboardInvestisseur.tsx
import { useState, useEffect } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { KpiCard, StatusBadge, GoldenSpinner, SectionLabel , ProjectCard} from '@/components/ui'
import { investmentsAPI, matchingAPI, reportingAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useScrollReveal } from '@/hooks/useCountUp'
import InvestModal from '@/components/dashboard/InvestModal'


const SECTOR_COLORS = ['#C9A84C','#E8C97A','#8B7535','#F5E9C8','#6B5A2A','#A08040']

export default function DashboardInvestisseur() {
  const isMobile = useIsMobile()
  useScrollReveal()
  const navigate = useNavigate()
  const [dashboard, setDashboard]   = useState<any>(null)
  const [recommendations, setRecos] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [modalProject, setModalProject] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      reportingAPI.dashboardInvestor(),
      matchingAPI.recommendations(),
      investmentsAPI.list(),
    ]).then(([dash, recos, inv]) => {
      setDashboard(dash.data)
      setRecos(recos.data.results ?? recos.data ?? [])
      setInvestments(inv.data.results ?? inv.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Tableau de bord">
      <GoldenSpinner />
    </DashboardLayout>
  )

  const { summary, sector_breakdown = {}, recent_investments = [] } = dashboard ?? {}
  const filters = ['Tous', 'Agriculture', 'Tech', 'Énergie', 'Santé', 'Immobilier']
  const filteredRecos = activeFilter === 'Tous'
    ? recommendations
    : recommendations.filter(p => p.sector_label?.includes(activeFilter))

  const donutData = Object.entries(sector_breakdown).map(([name, value]) => ({
    name, value: Math.round((value as number) / 1_000_000),
  }))

  return (
    <DashboardLayout
      navItems={NAV_INVESTISSEUR}
      title="Tableau de bord"
      subtitle={new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      headerActions={
        <button className="btn-gold-sm" onClick={() => navigate('/investisseur/projets')}>
          ◈ Explorer
        </button>
      }
    >
      {/* ── KPIs ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <KpiCard
          label="Portefeuille total"
          value={`${((summary?.total_invested ?? 0)/1_000_000).toFixed(0)}M ₣`}
          trend="↑ +8.4% YTD"
          trendUp
        />
        <KpiCard
          label="ROI moyen"
          value={`${summary?.average_roi ?? 0}%`}
          trend="↑ vs marché"
          trendUp
        />
        <KpiCard
          label="Projets actifs"
          value={summary?.active_investments ?? 0}
          sub={`${summary?.total_investments ?? 0} au total`}
          
        />
        <KpiCard
          label="Investissements"
          value={summary?.total_investments ?? 0}
          sub="Toutes durées"
          
        />
      </div>

      {/* ── Répartition sectorielle ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: 24, marginBottom: 28 }}>
        <div className="kpi-card card-hover" style={{ padding: 24 }}>
          <SectionLabel>Répartition sectorielle</SectionLabel>
          {donutData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>
              Aucun investissement
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {donutData.map((d, i) => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: SECTOR_COLORS[i % SECTOR_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{d.value}M ₣</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--dark-4)', borderRadius: 2 }}>
                    <div style={{ width: `${Math.min(100, (d.value / Math.max(...donutData.map(x => x.value))) * 100)}%`, height: '100%', background: SECTOR_COLORS[i % SECTOR_COLORS.length], borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projets recommandés */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <SectionLabel>Projets recommandés</SectionLabel>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {filters.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)} style={{
                    padding: '3px 10px', fontSize: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', border: '1px solid',
                    borderColor: activeFilter === f ? 'var(--gold)' : 'var(--border)',
                    background: activeFilter === f ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: activeFilter === f ? 'var(--gold)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all .2s',
                  }}>{f}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 16 }}>
            {filteredRecos.length > 0 ? filteredRecos.slice(0, 4).map((p: any) => (
              <ProjectCard
                key={p.id}
                project={{ ...p, matching_score: p.match_score }}
                onClick={() => setModalProject(p)}
              />
            )) : (
              <div style={{ gridColumn: '1/-1', padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                Aucun projet recommandé. <button className="btn-gold-sm" style={{ marginLeft: 12 }} onClick={() => navigate('/investisseur/projets')}>Explorer →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Portefeuille récent ──────────────────────── */}
      <div className="kpi-card card-hover" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <SectionLabel>Mon portefeuille</SectionLabel>
          <button className="btn-gold-sm" style={{ fontSize: 10 }} onClick={() => navigate('/investisseur/portfolio')}>
            Voir tout →
          </button>
        </div>
        {recent_investments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
            Aucun investissement. Explorez les projets recommandés.
          </p>
        ) : isMobile ? (
          // Mobile : cards au lieu de table
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent_investments.slice(0, 5).map((inv: any) => (
              <div key={inv.id} style={{ padding: '14px', background: 'var(--dark-4)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{inv.project_title}</span>
                  <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 16, color: 'var(--text)' }}>
                    {((inv.amount ?? 0)/1_000_000).toFixed(1)}M ₣
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    ROI : {inv.roi_agreed ? `${inv.roi_agreed}%` : '—'} · {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <StatusBadge status={inv.status} label={inv.status_label} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop : table
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Projet', 'Montant', 'ROI', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent_investments.map((inv: any) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text)' }}>{inv.project_title}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text)', fontFamily: '"Cormorant Garamond", serif' }}>
                      {((inv.amount ?? 0)/1_000_000).toFixed(1)}M ₣
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
          </div>
        )}
      </div>

      {modalProject && (
        <InvestModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          onSuccess={() => { setModalProject(null); window.location.reload() }}
        />
      )}
    </DashboardLayout>
  )
}
