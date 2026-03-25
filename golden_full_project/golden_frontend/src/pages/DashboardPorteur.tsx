// src/pages/DashboardPorteur.tsx
import { useState, useEffect } from 'react'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useLocation } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { KpiCard, ProgressBar, StatusBadge, GoldenSpinner, SectionLabel } from '@/components/ui'
import { reportingAPI, investmentsAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useScrollReveal } from '@/hooks/useCountUp'


export default function DashboardPorteur() {
  const { user } = useAuth()
  useScrollReveal()
  const isMobile = useIsMobile()
  const location = useLocation()
  const currentPath = location.pathname
  const [dashboard, setDashboard] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'apercu' | 'activite' | 'finances'>('apercu')

  useEffect(() => {
    Promise.all([
      reportingAPI.dashboardPorteur(),
      investmentsAPI.byProject && investmentsAPI.list(),
    ]).then(([dash]) => {
      setDashboard(dash.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Tableau de bord porteur">
      <GoldenSpinner />
    </DashboardLayout>
  )

  const { summary, projects = [] } = dashboard ?? {}
  const mainProject = projects[0]
  const fundingPct = mainProject?.funding_percentage ?? 0

  return (
    <DashboardLayout
      navItems={NAV_PORTEUR}
      title="Tableau de bord"
      subtitle={`Bonjour, ${user?.first_name ?? 'porteur'}`}
      headerActions={
        <button className="btn-gold-sm" onClick={() => window.location.href = '/porteur/nouveau'}>
          Modifier le projet
        </button>
      }
    >

      {/* ── Alerte si KYC non validé ──────────────── */}
      {!user?.is_kyc_verified && (
        <div style={{
          padding: '14px 20px', marginBottom: 24,
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13, color: '#fbbf24',
        }}>
          <span>⚠</span>
          <span>Votre vérification KYC est en attente. Soumettez vos documents pour activer votre projet.</span>
          <a href="/porteur/kyc" style={{ marginLeft: 'auto', color: '#fbbf24', fontSize: 12, textDecoration: 'underline' }}>
            Compléter →
          </a>
        </div>
      )}

      {/* ── KPIs ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16, marginBottom: 48 }}>
        <KpiCard
          label="Capital collecté"
          value={`${((summary?.total_raised ?? 0) / 1_000_000).toFixed(0)}M`}
          sub={`Objectif : ${((summary?.total_needed ?? 0) / 1_000_000).toFixed(0)}M FCFA`}
          trend="↑ +12% ce mois"
          trendUp
          
        />
        <KpiCard
          label="Investisseurs intéressés"
          value={summary?.total_interests ?? 0}
          sub="2 en négociation active"
          trend="↑ +3 cette semaine"
          trendUp
          
        />
        <KpiCard
          label="Vues du projet"
          value={summary?.total_views ?? 0}
          sub="Depuis mise en ligne"
          trend="↑ +28% cette semaine"
          trendUp
          
        />
        <KpiCard
          label="Projets actifs"
          value={summary?.active_projects ?? 0}
          sub={`${summary?.total_projects ?? 0} au total`}
          
        />
      </div>

      {/* ── Projet principal ─────────────────────── */}
      {mainProject ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 24, marginBottom: 48 }}>

          {/* Carte projet */}
          <div className="kpi-card card-hover" style={{ padding: 28 }}>
            {/* Onglets */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
              {(['apercu', 'activite', 'finances'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px', fontSize: 10,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'none', border: 'none',
                    borderBottom: activeTab === tab ? '1px solid var(--gold)' : '1px solid transparent',
                    color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)',
                    cursor: 'pointer', marginBottom: -1,
                    transition: 'color .2s',
                  }}
                >
                  {tab === 'apercu' ? 'Aperçu' : tab === 'activite' ? 'Activité' : 'Finances'}
                </button>
              ))}
            </div>

            {activeTab === 'apercu' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 24, fontWeight: 300, marginBottom: 6 }}>
                      {mainProject.title}
                    </h2>
                    <StatusBadge status={mainProject.status} label={mainProject.status_label} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secteur</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2 }}>{mainProject.sector}</div>
                  </div>
                </div>

                {/* Jauge financement */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progression du financement</span>
                    <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>{fundingPct}%</span>
                  </div>
                  <ProgressBar value={fundingPct} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{((mainProject.amount_raised ?? 0) / 1_000_000).toFixed(0)}M FCFA levés</span>
                    <span>Objectif : {((mainProject.amount_needed ?? 0) / 1_000_000).toFixed(0)}M FCFA</span>
                  </div>
                </div>

                {/* Stats mini */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {[
                    { label: 'ROI estimé', value: `${mainProject.roi_estimated}%` },
                    { label: 'Durée', value: `${mainProject.duration_months} mois` },
                    { label: 'Vues', value: mainProject.views },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '12px 16px', background: 'var(--dark-4)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: 'var(--text)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activite' && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                <p style={{ marginBottom: 16 }}>Activité récente sur votre projet :</p>
                {[
                  { msg: 'Ibrahim Traoré a ajouté votre projet en favori', time: 'Il y a 2h', color: '#4ade80' },
                  { msg: 'Nouvelle vue depuis Abidjan', time: 'Il y a 4h', color: 'var(--text-muted)' },
                  { msg: 'Votre projet a été validé par l\'équipe GOLDEN', time: 'Hier', color: 'var(--gold)' },
                ].map((a, i) => (
                  <div key={i} style={{
                    padding: '12px 0', borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: 12, alignItems: 'center',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12 }}>{a.msg}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'finances' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Montant recherché',   value: `${((mainProject?.amount_needed ?? 0)/1_000_000).toFixed(0)}M FCFA` },
                    { label: 'Montant levé',        value: `${((mainProject?.amount_raised ?? 0)/1_000_000).toFixed(0)}M FCFA` },
                    { label: 'Investissements',     value: mainProject?.investment_count ?? 0 },
                    { label: 'ROI estimé',          value: `${mainProject?.roi_estimated ?? 0}%` },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '16px', background: 'var(--dark-4)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 26, color: 'var(--text)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel investisseurs intéressés */}
          <div className="kpi-card card-hover" style={{ padding: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              Investisseurs intéressés
            </div>
            {[
              { name: 'Ibrahim Traoré', country: 'Côte d\'Ivoire', amount: '50M ₣', status: 'Négociation', statusColor: '#fbbf24' },
              { name: 'Marie Ouédraogo', country: 'Burkina Faso', amount: '30M ₣', status: 'Intéressé', statusColor: '#4ade80' },
              { name: 'Jean-Pierre Koffi', country: 'Bénin', amount: '20M ₣', status: 'En attente', statusColor: 'var(--text-muted)' },
            ].map((inv, i) => (
              <div key={i} style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  border: '1px solid var(--border-bright)',
                  display: 'grid', placeItems: 'center',
                  fontSize: 12, color: 'var(--gold)',
                }}>{inv.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{inv.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{inv.country} · {inv.amount}</div>
                </div>
                <span style={{ fontSize: 10, color: inv.statusColor }}>{inv.status}</span>
              </div>
            ))}
            <button className="btn-gold-sm" style={{ width: '100%', marginTop: 16, justifyContent: 'center', display: 'flex' }}>
              Voir tous →
            </button>
          </div>

        </div>
      ) : (
        <div className="kpi-card card-hover" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Vous n'avez pas encore de projet. Créez votre premier projet pour commencer.
          </p>
          <a href="/porteur/nouveau" className="btn-primary" style={{ display: 'inline-block' }}>
            Créer mon projet →
          </a>
        </div>
      )}

    </DashboardLayout>
  )
}
