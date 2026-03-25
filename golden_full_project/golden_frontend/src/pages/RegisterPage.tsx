// src/pages/RegisterPage.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { authAPI } from '@/lib/api'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '',
    email: '', phone_number: '',
    password: '', password2: '',
    role: (searchParams.get('role') ?? 'porteur') as 'porteur' | 'investisseur',
  })

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password2) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError('')
    try {
      await authAPI.register(form)
      await login(form.email, form.password)
      navigate(form.role === 'porteur' ? '/porteur' : '/investisseur')
    } catch (err: any) {
      const d = err.response?.data
      setError(typeof d?.detail === 'string' ? d.detail : d?.error ?? 'Une erreur est survenue.')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--text)', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color .2s',
  }

  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 9,
    letterSpacing: '.18em', textTransform: 'uppercase',
    color: 'var(--text-muted)', marginBottom: 7,
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG */}
      {[500, 700].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: s, height: s,
          border: `1px solid rgba(201,168,76,${i === 0 ? .05 : .03})`,
          bottom: i === 0 ? -150 : -250, left: i === 0 ? -150 : -250,
          animation: `rotate ${i === 0 ? 45 : 65}s linear infinite`,
          pointerEvents: 'none',
        }} />
      ))}
      <div style={{
        position: 'absolute', top: -200, right: -100,
        width: 500, height: 500, borderRadius: '50%',
        border: '1px solid rgba(201,168,76,.04)',
        animation: 'rotate 55s linear infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 500,
        background: 'var(--dark-2)',
        border: '1px solid rgba(201,168,76,0.18)',
        padding: '44px 40px',
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity .7s ease, transform .7s ease',
      }}>
        {/* Top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, margin: '0 auto 14px',
            border: '1px solid #C9A84C', transform: 'rotate(45deg)',
            display: 'grid', placeItems: 'center',
          }}>
            <span style={{
              transform: 'rotate(-45deg)',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 20, fontWeight: 600, color: 'var(--gold)',
            }}>G</span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 24, fontWeight: 300, color: 'var(--text)',
            letterSpacing: '.06em', marginBottom: 6,
          }}>Créer un compte</h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            GOLDEN Investissement — Rejoignez la plateforme
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `1px solid ${step >= s ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
                background: step >= s ? 'rgba(201,168,76,.15)' : 'transparent',
                display: 'grid', placeItems: 'center',
                fontSize: 11, color: step >= s ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'all .3s',
              }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 1, background: step > 1 ? 'var(--gold)' : 'rgba(201,168,76,.2)', transition: 'background .3s' }} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Étape 1 */}
          {step === 1 && (
            <div style={{ animation: 'slideUp .4s ease' }}>
              {/* Rôle */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Je suis</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { val: 'porteur', label: '💡 Porteur de projet' },
                    { val: 'investisseur', label: '💰 Investisseur' },
                  ].map(r => (
                    <div key={r.val} onClick={() => setForm(f => ({ ...f, role: r.val as 'porteur' | 'investisseur' }))} style={{
                      padding: '12px 14px', cursor: 'pointer',
                      background: form.role === r.val ? 'rgba(201,168,76,.1)' : 'rgba(255,255,255,.03)',
                      border: `1px solid ${form.role === r.val ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
                      color: form.role === r.val ? 'var(--gold-light)' : 'var(--text-muted)',
                      fontSize: 12, textAlign: 'center', transition: 'all .2s',
                    }}>{r.label}</div>
                  ))}
                </div>
              </div>

              {/* Noms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Prénom</label>
                  <input style={inp} required value={form.first_name} onChange={set('first_name')} placeholder="Kofi"
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
                </div>
                <div>
                  <label style={lbl}>Nom</label>
                  <input style={inp} required value={form.last_name} onChange={set('last_name')} placeholder="Mensah"
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Email</label>
                <input type="email" style={inp} required value={form.email} onChange={set('email')} placeholder="vous@exemple.com"
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Téléphone</label>
                <input style={inp} value={form.phone_number} onChange={set('phone_number')} placeholder="+229 97 XX XX XX"
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
              </div>

              <button type="button" onClick={() => { if (!form.first_name || !form.email) { setError('Remplissez les champs requis.'); return } setError(''); setStep(2) }} style={{
                width: '100%', padding: '13px',
                background: 'var(--gold)', color: 'var(--dark)',
                border: 'none', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s',
              }}
                onMouseEnter={e => (e.target as HTMLElement).style.background = 'var(--gold-light)'}
                onMouseLeave={e => (e.target as HTMLElement).style.background = 'var(--gold)'}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div style={{ animation: 'slideUp .4s ease' }}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Mot de passe</label>
                <input type="password" style={inp} required value={form.password} onChange={set('password')} placeholder="Min. 8 caractères"
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Confirmer le mot de passe</label>
                <input type="password" style={inp} required value={form.password2} onChange={set('password2')} placeholder="••••••••"
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'} />
              </div>

              {/* Récap */}
              <div style={{
                padding: '14px 16px', marginBottom: 20,
                background: 'rgba(201,168,76,.06)',
                border: '1px solid rgba(201,168,76,.15)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>Récapitulatif</div>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{form.first_name} {form.last_name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{form.email} · {form.role}</div>
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', marginBottom: 16,
                  background: 'rgba(224,92,92,.08)',
                  border: '1px solid rgba(224,92,92,.25)',
                  color: '#E05C5C', fontSize: 12,
                }}>{error}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  padding: '13px', background: 'transparent',
                  border: '1px solid rgba(201,168,76,.3)', color: 'var(--text-muted)',
                  fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', transition: 'all .2s',
                }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--gold)'; (e.target as HTMLElement).style.color = 'var(--gold)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,.3)'; (e.target as HTMLElement).style.color = 'var(--text-muted)' }}
                >← Retour</button>
                <button type="submit" disabled={loading} style={{
                  padding: '13px',
                  background: loading ? 'rgba(201,168,76,.6)' : 'var(--gold)',
                  color: 'var(--dark)', border: 'none',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                  letterSpacing: '.12em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s',
                }}
                  onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold-light)' }}
                  onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold)' }}
                >
                  {loading ? 'Création...' : 'Créer mon compte →'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ width: '100%', height: 1, background: 'rgba(201,168,76,.1)', marginBottom: 18 }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
              Se connecter →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
