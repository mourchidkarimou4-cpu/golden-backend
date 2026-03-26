// src/pages/porteur/FinancesPage.tsx
import { useState, useEffect } from 'react'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import { useIsMobile } from '@/hooks/useBreakpoint'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel, ProgressBar, SkeletonKpiGrid, EmptyState, NegotiationFlow, BarChart } from '@/components/ui'
import { DollarSign } from 'lucide-react'
import { reportingAPI, investmentsAPI, analyticsAPI } from '@/lib/api'


export default function FinancesPage() {
  const isMobile = useIsMobile()
  const [dashboard, setDashboard] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      reportingAPI.dashboardPorteur(),
      investmentsAPI.list(),
      analyticsAPI.get(),
    ]).then(([dash, inv, ana]) => {
      setAnalytics(ana.data)
      setDashboard(dash.data)
      setInvestments(inv.data.results ?? inv.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Finances">
      <SkeletonKpiGrid />
    </DashboardLayout>
  )

  const { projects = [] } = dashboard ?? {}
  const mainProject = projects[0]
  const totalRaised = investments.reduce((s, i) => s + (i.amount ?? 0), 0)
  const amountNeeded = mainProject?.amount_needed ?? 0
  const pct = amountNeeded > 0 ? Math.min(100, Math.round((totalRaised / amountNeeded) * 100)) : 0
  const MONTHS = (analytics?.monthly_funding ?? []).map((m: any) => m.month)
  const mockData = (analytics?.monthly_funding ?? []).map((m: any) => m.amount)

  return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Finances" subtitle="Suivi financier de votre projet">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Capital levé', value: `${(totalRaised/1_000_000).toFixed(1)}M`, unit: 'FCFA' },
          { label: 'Objectif', value: `${(amountNeeded/1_000_000).toFixed(1)}M`, unit: 'FCFA' },
          { label: 'Progression', value: `${pct}%`, unit: '' },
          { label: 'ROI estimé', value: `${mainProject?.roi_estimated ?? 0}%`, unit: 'annuel' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 30, color: 'var(--text)' }}>{k.value}</div>
            {k.unit && <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{k.unit}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 24 }}>
        <div className="kpi-card" style={{ padding: 28 }}>
          <SectionLabel>Évolution du financement (6 mois)</SectionLabel>
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <BarChart labels={MONTHS} data={mockData} label="Capital levé (M FCFA)" height={160} />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progression globale</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
            </div>
            <ProgressBar value={pct} />
          </div>
        </div>
        <div className="kpi-card" style={{ padding: 24 }}>
          <SectionLabel>Investissements reçus</SectionLabel>
          {investments.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="Aucun investissement reçu"
              description="Les investissements reçus apparaîtront ici."
            />
          ) : (
            investments.slice(0, 6).map((inv: any, i: number) => (
              <NegotiationFlow
                key={i}
                investmentId={inv.id}
                investorName={inv.investor_name}
                amount={inv.amount ?? 0}
                status={inv.status ?? 'pending'}
                createdAt={inv.created_at}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
