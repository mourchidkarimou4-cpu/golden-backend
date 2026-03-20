// src/pages/RegisterPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'var(--dark-3)',
  border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 14,
  outline: 'none', transition: 'border-color .2s',
  fontFamily: 'inherit',
}

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone_number: '', password: '', password2: '',
    role: 'porteur' as 'porteur' | 'investisseur',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await authAPI.register(form)
      await login(form.email, form.password)
    } catch (err: any) {
      const d = err.response?.data
      setError(d?.email?.[0] ?? d?.password?.[0] ?? d?.detail ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <GoldenLogo />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rejoignez la plateforme</p>
        </div>

        {/* Toggle porteur / investisseur */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--border)', marginBottom: 28,
        }}>
          {(['porteur', 'investisseur'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setForm(f => ({ ...f, role: r }))}
              style={{
                padding: '12px 0', fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: form.role === r ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: 'none',
                borderBottom: form.role === r ? '2px solid var(--gold)' : '2px solid transparent',
                color: form.role === r ? 'var(--gold)' : 'var(--text-muted)',
                cursor: 'none', transition: 'all .2s',
              }}
            >
              {r === 'porteur' ? '💡 Porteur de projet' : '💰 Investisseur'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Prénom</label>
              <input type="text" required value={form.first_name} onChange={set('first_name')}
                style={inputStyle} placeholder="Kofi"
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={labelStyle}>Nom</label>
              <input type="text" required value={form.last_name} onChange={set('last_name')}
                style={inputStyle} placeholder="Mensah"
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" required value={form.email} onChange={set('email')}
              style={inputStyle} placeholder="kofi@exemple.com"
              onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Téléphone (Mobile Money)</label>
            <input type="tel" value={form.phone_number} onChange={set('phone_number')}
              style={inputStyle} placeholder="+229 97 XX XX XX"
              onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" required value={form.password} onChange={set('password')}
                style={inputStyle} placeholder="Min. 8 caractères"
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={labelStyle}>Confirmer</label>
              <input type="password" required value={form.password2} onChange={set('password2')}
                style={inputStyle} placeholder="••••••••"
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          {error && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', padding: '14px 0', fontSize: 12, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Création...' : `Créer mon compte ${form.role}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            Se connecter →
          </Link>
        </p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'var(--text-muted)', display: 'block', marginBottom: 7,
}
