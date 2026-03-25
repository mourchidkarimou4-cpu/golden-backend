// src/pages/porteur/InvestisseursPage.tsx
import { useState, useEffect } from 'react'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel, SkeletonTable, SkeletonKpiGrid, EmptyState } from '@/components/ui'
import { Users, CheckCircle, DollarSign, MessageSquare } from 'lucide-react'
import { investmentsAPI } from '@/lib/api'
import { useNavigate } from 'react-router-dom'


const STATUS_COLOR: Record<string, string> = {
  pending:   '#fbbf24',
  confirmed: '#4ade80',
  cancelled: '#f87171',
  completed: '#60a5fa',
}

export default function InvestisseursPage() {
  const navigate = useNavigate()
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'tous' | 'pending' | 'confirmed'>('tous')

  useEffect(() => {
    investmentsAPI.list().then(({ data }) => {
      setInvestments(data.results ?? data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'tous' ? investments : investments.filter(i => i.status === filter)
  const totalRaised = investments.reduce((s, i) => s + (i.amount ?? 0), 0)
  const confirmed = investments.filter(i => i.status === 'confirmed').length

  if (loading) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Investisseurs">
      <SkeletonKpiGrid />
      <SkeletonTable rows={5} />
    </DashboardLayout>
  )

  return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Investisseurs" subtitle="Gérez vos relations investisseurs">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total investisseurs', value: investments.length, Icon: Users },
          { label: 'Confirmés', value: confirmed, Icon: CheckCircle },
          { label: 'Capital levé', value: `${(totalRaised/1_000_000).toFixed(1)}M FCFA`, Icon: DollarSign },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
              <k.Icon size={16} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: 'var(--text)' }}>{k.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="kpi-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
          {(['tous', 'pending', 'confirmed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', background: 'none', border: 'none',
              borderBottom: filter === f ? '1px solid var(--gold)' : '1px solid transparent',
              color: filter === f ? 'var(--gold)' : 'var(--text-muted)',
              cursor: 'pointer', marginBottom: -1, transition: 'color .2s',
            }}>
              {f === 'tous' ? 'Tous' : f === 'pending' ? 'En attente' : 'Confirmés'}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun investisseur"
            description="Aucun investisseur ne correspond à ce filtre pour le moment."
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Investisseur', 'Montant', 'Statut', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, border: '1px solid var(--border-bright)', display: 'grid', placeItems: 'center', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                        {inv.investor_name?.[0] ?? 'I'}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text)' }}>{inv.investor_name ?? 'Investisseur'}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{inv.investor_email ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 0', fontSize: 13, color: 'var(--text)', fontFamily: '"Cormorant Garamond", serif' }}>
                    {((inv.amount ?? 0)/1_000_000).toFixed(1)}M ₣
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontSize: 10, padding: '3px 10px', background: `${STATUS_COLOR[inv.status] ?? 'var(--text-muted)'}22`, color: STATUS_COLOR[inv.status] ?? 'var(--text-muted)', letterSpacing: '0.08em' }}>
                      {inv.status ?? 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', fontSize: 11, color: 'var(--text-muted)' }}>
                    {inv.created_at ? new Date(inv.created_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <button className="btn-gold-sm" onClick={() => navigate('/porteur/messages')} style={{ fontSize: 10 }}>Contacter</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
