// src/pages/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(email, password)
      // Redirige selon le rôle (géré dans App.tsx via PublicRoute)
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <GoldenLogo />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 7 }}>
              Adresse email
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 7 }}>
              Mot de passe
            </label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          {error && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', padding: '14px 0', fontSize: 12, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            S'inscrire →
          </Link>
        </p>
      </div>
    </div>
  )
}

// src/pages/RegisterPage.tsx — dans le même fichier pour simplifier
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'var(--dark-3)',
  border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 14,
  outline: 'none', transition: 'border-color .2s',
  fontFamily: 'inherit',
}
