// src/pages/investisseur/RapportsPage.tsx
import { useState, useEffect } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel } from '@/components/ui'
import { BarChart2, DollarSign, AlertTriangle, Download } from 'lucide-react'
import { reportingAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


const RAPPORTS = [
  { title: 'Rapport de performance Q1 2026', date: 'Mars 2026', type: 'Performance', Icon: BarChart2 },
  { title: 'Rapport de portefeuille mensuel', date: 'Février 2026', type: 'Portfolio', Icon: DollarSign },
  { title: 'Analyse de risque sectorielle', date: 'Janvier 2026', type: 'Risque', Icon: AlertTriangle },
]

export default function RapportsPage() {
  const isMobile = useIsMobile()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportingAPI.dashboardInvestor().then(({ data }) => {
      setDashboard(data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Rapports">
      <GoldenSpinner />
    </DashboardLayout>
  )

  const { summary } = dashboard ?? {}

  const exportCSV = () => {
    const rows = [
      ['Indicateur', 'Valeur'],
      ['Investissements actifs', summary?.active_investments ?? 0],
      ['Capital total investi (M FCFA)', ((summary?.total_invested ?? 0)/1_000_000).toFixed(1)],
      ['Retour moyen (%)', summary?.avg_roi ?? 0],
      ['Projets suivis', summary?.total_projects ?? 0],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'rapport_investisseur_golden.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Rapports" subtitle="Analyses et synthèses de vos investissements"
      headerActions={
        <button className="btn-gold-sm" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={13} strokeWidth={1.5} /> Exporter CSV
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Résumé */}
          <div className="kpi-card" style={{ padding: 28 }}>
            <SectionLabel>Résumé exécutif</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 16, marginTop: 20 }}>
              {[
                { label: 'Investissements actifs', value: summary?.active_investments ?? 0 },
                { label: 'Capital total investi', value: `${((summary?.total_invested ?? 0)/1_000_000).toFixed(1)}M ₣` },
                { label: 'Retour moyen', value: `${summary?.avg_roi ?? 0}%` },
              ].map(s => (
                <div key={s.label} style={{ padding: 20, background: 'var(--dark-4)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rapports disponibles */}
          <div className="kpi-card" style={{ padding: 28 }}>
            <SectionLabel>Rapports disponibles</SectionLabel>
            {RAPPORTS.map((r, i) => (
              <div key={i} style={{
                padding: 16, marginBottom: 12,
                background: 'var(--dark-4)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ width: 40, height: 40, border: '1px solid var(--border-bright)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <r.Icon size={16} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{r.type} · {r.date}</div>
                </div>
                <button className="btn-gold-sm" style={{ fontSize: 10, flexShrink: 0 }}>Télécharger</button>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateurs */}
        <div className="kpi-card" style={{ padding: 24 }}>
          <SectionLabel>Indicateurs clés</SectionLabel>
          {[
            { label: 'Taux de succès', value: '87%', trend: '+5%' },
            { label: 'ROI moyen', value: `${summary?.avg_roi ?? 0}%`, trend: '+2%' },
            { label: 'Durée moyenne', value: '24 mois', trend: '' },
            { label: 'Projets suivis', value: summary?.total_projects ?? 0, trend: '' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, color: 'var(--text)' }}>{s.value}</span>
                {s.trend && <span style={{ fontSize: 11, color: '#4ade80' }}>↑ {s.trend}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
