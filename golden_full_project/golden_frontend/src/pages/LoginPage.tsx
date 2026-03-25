// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      const stored = JSON.parse(localStorage.getItem('golden_user') ?? '{}')
      navigate(stored.role === 'porteur' ? '/porteur' : '/investisseur')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--text)', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color .2s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG circles */}
      {[600, 400].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: s, height: s,
          border: `1px solid rgba(201,168,76,${i === 0 ? .05 : .03})`,
          top: i === 0 ? -200 : -100, right: i === 0 ? -200 : -50,
          animation: `rotate ${i === 0 ? 50 : 35}s linear infinite${i === 1 ? ' reverse' : ''}`,
          pointerEvents: 'none',
        }} />
      ))}
      <div style={{
        position: 'absolute', bottom: -200, left: -200,
        width: 500, height: 500, borderRadius: '50%',
        border: '1px solid rgba(201,168,76,.04)',
        animation: 'rotate 40s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--dark-2)',
        border: '1px solid rgba(201,168,76,0.18)',
        padding: '48px 40px',
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity .7s ease, transform .7s ease',
      }}>
        {/* Top gold line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, margin: '0 auto 16px',
            border: '1px solid #C9A84C',
            transform: 'rotate(45deg)',
            display: 'grid', placeItems: 'center',
          }}>
            <span style={{
              transform: 'rotate(-45deg)',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 22, fontWeight: 600, color: 'var(--gold)',
            }}>G</span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 26, fontWeight: 300, color: 'var(--text)',
            letterSpacing: '.06em', marginBottom: 6,
          }}>Connexion</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '.04em' }}>
            Bienvenue sur GOLDEN Investissement
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{
            marginBottom: 16,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .5s .15s ease, transform .5s .15s ease',
          }}>
            <label style={{
              display: 'block', fontSize: 9,
              letterSpacing: '.18em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: 8,
            }}>Adresse email</label>
            <input
              type="email" required style={inp}
              value={form.email}
              placeholder="vous@exemple.com"
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'}
            />
          </div>

          {/* Password */}
          <div style={{
            marginBottom: 24,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .5s .25s ease, transform .5s .25s ease',
          }}>
            <label style={{
              display: 'block', fontSize: 9,
              letterSpacing: '.18em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: 8,
            }}>Mot de passe</label>
            <input
              type="password" required style={inp}
              value={form.password}
              placeholder="••••••••"
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.2)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: 16,
              background: 'rgba(224,92,92,.08)',
              border: '1px solid rgba(224,92,92,.25)',
              color: '#E05C5C', fontSize: 12,
              animation: 'fadeIn .3s ease',
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(201,168,76,.6)' : 'var(--gold)',
              color: 'var(--dark)', border: 'none',
              fontFamily: 'inherit', fontSize: 12,
              fontWeight: 500, letterSpacing: '.12em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s, transform .15s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
            }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold-light)' }}
            onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--gold)' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter →'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 28, textAlign: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity .5s .4s ease',
        }}>
          <div style={{ width: '100%', height: 1, background: 'rgba(201,168,76,.1)', marginBottom: 20 }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
              Créer un compte →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  )
}
