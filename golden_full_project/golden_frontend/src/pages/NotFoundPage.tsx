// src/pages/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <GoldenLogo size="lg" />
      <div style={{
        marginTop: 48,
        fontSize: 96, fontWeight: 300,
        fontFamily: 'Cormorant Garamond, serif',
        color: 'var(--gold)', lineHeight: 1, opacity: 0.4,
        letterSpacing: '-0.02em',
      }}>404</div>
      <h1 style={{
        marginTop: 16, fontSize: 22, fontWeight: 400,
        color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif',
        letterSpacing: '0.02em',
      }}>Page introuvable</h1>
      <p style={{
        marginTop: 12, fontSize: 14, color: 'var(--text-muted)',
        maxWidth: 360, lineHeight: 1.7,
      }}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', background: 'none',
          border: '1px solid var(--border-bright)',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          <ArrowLeft size={14} strokeWidth={1.5} /> Retour
        </button>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', background: 'var(--gold)',
          border: 'none', color: 'var(--dark)',
          cursor: 'pointer', fontSize: 12,
          letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          <Home size={14} strokeWidth={1.5} /> Accueil
        </button>
      </div>
    </div>
  )
}
