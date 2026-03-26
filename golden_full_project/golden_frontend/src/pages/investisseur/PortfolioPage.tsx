// src/pages/investisseur/PortfolioPage.tsx
import { useState, useEffect } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel, ProgressBar, SkeletonKpiGrid, EmptyState, RatingWidget, NegotiationFlow, LineChart } from '@/components/ui'
import { TrendingUp } from 'lucide-react'
import { investmentsAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


export default function PortfolioPage() {
  const isMobile = useIsMobile()
  const [portfolio, setPortfolio] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      investmentsAPI.portfolio(),
      investmentsAPI.list(),
    ]).then(([port, inv]) => {
      setPortfolio(port.data)
      setInvestments(inv.data.results ?? inv.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Portfolio">
      <SkeletonKpiGrid />
    </DashboardLayout>
  )

  const totalInvested = investments.reduce((s, i) => s + (i.amount ?? 0), 0)
  const totalReturn   = investments.reduce((s, i) => s + ((i.amount ?? 0) * (i.roi_agreed ?? 0) / 100), 0)

  const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
  const mockData = [5, 12, 8, 20, 15, 25]
  const maxVal = Math.max(...mockData)

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Portfolio" subtitle="Suivi de vos investissements">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total investi',    value: `${(totalInvested/1_000_000).toFixed(1)}M`, unit: 'FCFA' },
          { label: 'Retour estimé',    value: `${(totalReturn/1_000_000).toFixed(1)}M`,   unit: 'FCFA' },
          { label: 'Investissements',  value: investments.length,                          unit: 'actifs' },
          { label: 'ROI moyen',        value: `${portfolio?.avg_roi ?? 0}%`,               unit: 'annuel' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: 'var(--text)' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{k.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 24 }}>
        {/* Graphique */}
        <div className="kpi-card" style={{ padding: 28 }}>
          <SectionLabel>Évolution du portfolio (6 mois)</SectionLabel>

          <div style={{ marginTop: 24, marginBottom: 16 }}>
            {investments.length > 0 && <LineChart labels={MONTHS} datasets={[{ label: 'Portfolio (M FCFA)', data: mockData, color: '#B87333' }]} height={160} />}
          </div>

          {/* Liste investissements */}
          <SectionLabel>Mes investissements</SectionLabel>
          {investments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>
              Aucun investissement pour le moment.
            </p>
          ) : investments.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Aucun investissement"
              description="Explorez les projets disponibles et faites votre premier investissement."
              action={{ label: 'Explorer les projets', onClick: () => window.location.href = '/investisseur/projets' }}
            />
          ) : (
            investments.map((inv: any, i: number) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 8 }}>
              <div style={{
                padding: '14px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{inv.project_title ?? 'Projet'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                    ROI : {inv.roi_agreed ?? 0}% · {inv.duration_months ?? 0} mois
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, color: 'var(--text)' }}>
                    {((inv.amount ?? 0)/1_000_000).toFixed(1)}M ₣
                  </div>
                  <div style={{ fontSize: 10, color: inv.status === 'confirmed' ? '#4ade80' : '#fbbf24', marginTop: 2 }}>
                    {inv.status ?? 'pending'}
                  </div>
                </div>
              </div>
              <NegotiationFlow
                investmentId={inv.id}
                investorName="Moi"
                amount={inv.amount ?? 0}
                status={inv.status ?? 'pending'}
                createdAt={inv.created_at}
              />
              {(inv.status === 'confirmed' || inv.status === 'completed') && (
                <RatingWidget
                  investmentId={inv.id}
                  currentScore={inv.rating?.score ?? 0}
                  currentComment={inv.rating?.comment ?? ''}
                />
              )}
            </div>
            ))
          )}
        </div>

        {/* Répartition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Répartition par secteur</SectionLabel>
            {[
              { label: 'Agro-industrie', pct: 40, color: '#4ade80' },
              { label: 'Technologie',    pct: 30, color: 'var(--gold)' },
              { label: 'Énergie',        pct: 20, color: '#60a5fa' },
              { label: 'Autre',          pct: 10, color: 'var(--text-muted)' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: s.color }}>{s.pct}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--dark-4)', borderRadius: 2 }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Performance</SectionLabel>
            {[
              { label: 'Meilleur ROI',    value: `${portfolio?.best_roi ?? 0}%`,   color: '#4ade80' },
              { label: 'ROI moyen',       value: `${portfolio?.avg_roi ?? 0}%`,    color: 'var(--gold)' },
              { label: 'Projets actifs',  value: portfolio?.active_count ?? 0,     color: 'var(--text)' },
              { label: 'Projets clôturés',value: portfolio?.closed_count ?? 0,     color: 'var(--text-muted)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
