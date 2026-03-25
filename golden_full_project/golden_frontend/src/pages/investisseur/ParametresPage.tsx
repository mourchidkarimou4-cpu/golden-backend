// src/pages/investisseur/ParametresPage.tsx
import { useState } from 'react'
import { NAV_INVESTISSEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { SectionLabel } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { authAPI } from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useBreakpoint'


const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'var(--dark-3)', border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
}

export default function ParametresPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notifs, setNotifs] = useState({
    email_opportunite: true,
    email_message: true,
    email_rapport: true,
    email_rendement: false,
  })

  const handlePwChange = async () => {
    setPwError('')
    if (pwForm.new_password !== pwForm.confirm) { setPwError('Les mots de passe ne correspondent pas.'); return }
    if (pwForm.new_password.length < 8) { setPwError('Minimum 8 caractères.'); return }
    setSaving(true)
    try {
      await authAPI.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password })
      setPwSuccess(true)
      setPwForm({ old_password: '', new_password: '', confirm: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    } catch {
      setPwError('Mot de passe actuel incorrect.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout navItems={NAV_INVESTISSEUR} title="Paramètres" subtitle="Gérez votre compte">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/investisseur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kpi-card" style={{ padding: 28 }}>
            <SectionLabel>Sécurité — Changer le mot de passe</SectionLabel>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Mot de passe actuel', key: 'old_password' },
                { label: 'Nouveau mot de passe', key: 'new_password' },
                { label: 'Confirmer', key: 'confirm' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type="password" style={input} value={(pwForm as any)[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder="••••••••" />
                </div>
              ))}
              {pwError && <p style={{ fontSize: 12, color: '#f87171' }}>{pwError}</p>}
              {pwSuccess && <p style={{ fontSize: 12, color: '#4ade80' }}>✓ Mot de passe mis à jour.</p>}
              <button className="btn-primary" onClick={handlePwChange} disabled={saving} style={{ opacity: saving ? 0.7 : 1, marginTop: 8 }}>
                {saving ? 'Enregistrement...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </div>

          <div className="kpi-card" style={{ padding: 28 }}>
            <SectionLabel>Préférences de notifications</SectionLabel>
            <div style={{ marginTop: 20 }}>
              {[
                { key: 'email_opportunite', label: 'Nouvelles opportunités d\'investissement' },
                { key: 'email_message', label: 'Nouveau message' },
                { key: 'email_rapport', label: 'Rapport mensuel disponible' },
                { key: 'email_rendement', label: 'Mise à jour des rendements' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{n.label}</span>
                  <div onClick={() => setNotifs(p => ({ ...p, [n.key]: !(p as any)[n.key] }))}
                    style={{ width: 40, height: 22, borderRadius: 11, background: (notifs as any)[n.key] ? 'var(--gold)' : 'var(--dark-4)', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                    <div style={{ position: 'absolute', top: 2, left: (notifs as any)[n.key] ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: (notifs as any)[n.key] ? 'var(--dark)' : 'var(--text-muted)', transition: 'left .2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Session</SectionLabel>
            <button className="btn-gold-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              onClick={async () => { await logout(); navigate('/') }}>
              ⏻ Se déconnecter
            </button>
          </div>
          <div className="kpi-card" style={{ padding: 24, border: '1px solid rgba(248,113,113,0.2)' }}>
            <SectionLabel>Zone de danger</SectionLabel>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '12px 0', lineHeight: 1.6 }}>
              La suppression de votre compte est irréversible.
            </p>
            <button style={{ width: '100%', padding: 10, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', cursor: 'pointer' }}
              onClick={() => alert('Contactez le support pour supprimer votre compte.')}>
              Supprimer mon compte
            </button>
          </div>
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Version</SectionLabel>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>GOLDEN Investissement v1.0</p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>© 2026 GOLDEN. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
