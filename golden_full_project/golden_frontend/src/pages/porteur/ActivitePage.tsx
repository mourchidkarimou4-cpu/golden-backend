// src/pages/porteur/ActivitePage.tsx
import DashboardLayout from '@/components/layout/DashboardLayout'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import { SectionLabel } from '@/components/ui'
import { useIsMobile } from '@/hooks/useBreakpoint'


const ACTIVITIES = [
  { msg: "Ibrahim Traoré a ajouté votre projet en favori", time: 'Il y a 2h', color: '#4ade80' },
  { msg: "Nouvelle vue depuis Abidjan, Côte d'Ivoire", time: 'Il y a 4h', color: 'var(--text-muted)' },
  { msg: "Votre projet a été validé par l'équipe GOLDEN", time: 'Hier 14:30', color: 'var(--gold)' },
  { msg: "Marie Ouédraogo a envoyé un message", time: 'Hier 09:15', color: '#60a5fa' },
  { msg: "Nouveau investissement de 15M FCFA reçu", time: 'Il y a 3 jours', color: '#4ade80' },
  { msg: "Jean-Pierre Koffi consulte votre dossier", time: 'Il y a 4 jours', color: 'var(--text-muted)' },
  { msg: "Document BP_GOLDEN_2024.pdf téléchargé", time: 'Il y a 5 jours', color: '#fbbf24' },
  { msg: "Votre profil KYC est en cours de vérification", time: 'Il y a 1 semaine', color: '#fbbf24', icon: '⚠' },
]

export default function ActivitePage() {
  const isMobile = useIsMobile()
  return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Activité" subtitle="Historique de votre compte">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        <div className="kpi-card" style={{ padding: 28 }}>
          <SectionLabel>Activité récente</SectionLabel>
          {ACTIVITIES.map((a, i) => (
            <div key={i} style={{
              padding: '16px 0',
              borderBottom: i < ACTIVITIES.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', gap: 16, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                border: `1px solid ${a.color}44`,
                display: 'grid', placeItems: 'center',
                fontSize: 14, color: a.color,
              }}></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4, lineHeight: 1.5 }}>{a.msg}</p>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{a.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Cette semaine</SectionLabel>
            {[
              { label: 'Nouvelles vues', value: '+28', color: '#4ade80' },
              { label: 'Nouveaux favoris', value: '+3', color: 'var(--gold)' },
              { label: 'Messages reçus', value: '5', color: '#60a5fa' },
              { label: 'Investissements', value: '1', color: '#4ade80' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Action requise</SectionLabel>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 12 }}>
              Vous avez <span style={{ color: 'var(--gold)' }}>1 action</span> en attente : compléter votre dossier KYC.
            </p>
            <button className="btn-gold-sm" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
              onClick={() => window.location.href = '/kyc'}>
              Compléter le KYC →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
