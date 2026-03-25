// src/pages/investisseur/ProfilPage.tsx
import { useState } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { SectionLabel } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { authAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'var(--dark-3)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
}

export default function ProfilPage() {
  const { user, refreshUser } = useAuth()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({
    first_name:   user?.first_name ?? '',
    last_name:    user?.last_name  ?? '',
    phone_number: user?.phone_number ?? '',
    city:         user?.city ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    await authAPI.updateMe(form).catch(() => {})
    await refreshUser()
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Mon Profil" subtitle="Gérez vos informations personnelles">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        <div className="kpi-card" style={{ padding: 32 }}>
          <SectionLabel>Informations personnelles</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Prénom</label>
              <input style={input} value={form.first_name} onChange={set('first_name')} />
            </div>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nom</label>
              <input style={input} value={form.last_name} onChange={set('last_name')} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input style={{ ...input, opacity: 0.5 }} value={user?.email ?? ''} readOnly />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Téléphone</label>
              <input style={input} value={form.phone_number} onChange={set('phone_number')} placeholder="+229 97 XX XX XX" />
            </div>
            <div>
              <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Ville</label>
              <input style={input} value={form.city} onChange={set('city')} placeholder="Cotonou" />
            </div>
          </div>
          {success && (
            <div style={{ padding: '10px 16px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: 12, marginBottom: 16 }}>
              ✓ Profil mis à jour avec succès.
            </div>
          )}
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kpi-card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 16px', border: '2px solid var(--gold)', display: 'grid', placeItems: 'center', fontSize: 32, color: 'var(--gold)' }}>
              {user?.first_name?.[0] ?? '?'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{user?.full_name}</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Investisseur</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{user?.country}</div>
          </div>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Statut KYC</SectionLabel>
            <div style={{
              padding: '12px 16px', marginTop: 12,
              background: user?.is_kyc_verified ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
              border: `1px solid ${user?.is_kyc_verified ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
              color: user?.is_kyc_verified ? '#4ade80' : '#fbbf24', fontSize: 12,
            }}>
              {user?.is_kyc_verified ? '✓ Vérifié' : '⚠ En attente de vérification'}
            </div>
            {!user?.is_kyc_verified && (
              <button className="btn-gold-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                onClick={() => window.location.href = '/kyc'}>
                Compléter le KYC →
              </button>
            )}
          </div>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Préférences</SectionLabel>
            {[
              { label: 'Profil de risque', value: user?.risk_profile ?? '—' },
              { label: 'Invest. min', value: user?.min_investment ? `${(user.min_investment/1_000_000).toFixed(1)}M ₣` : '—' },
              { label: 'Invest. max', value: user?.max_investment ? `${(user.max_investment/1_000_000).toFixed(1)}M ₣` : '—' },
              { label: 'Membre depuis', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
