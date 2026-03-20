// src/components/ui/KycBanner.tsx
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function KycBanner() {
  const { user, needsKyc } = useAuth()
  if (!needsKyc) return null

  const isPending  = user?.kyc_status === 'pending'
  const isRejected = user?.kyc_status === 'rejected'

  if (isPending) return (
    <div style={{
      padding: '12px 20px', marginBottom: 24,
      background: 'rgba(251,191,36,0.06)',
      border: '1px solid rgba(251,191,36,0.25)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 13,
    }}>
      <span style={{ color: '#fbbf24' }}>⏳</span>
      <span style={{ color: 'var(--text-muted)', flex: 1 }}>
        Votre dossier KYC est en cours d'examen par notre équipe (24-48h).
      </span>
    </div>
  )

  if (isRejected) return (
    <div style={{
      padding: '12px 20px', marginBottom: 24,
      background: 'rgba(239,68,68,0.06)',
      border: '1px solid rgba(239,68,68,0.25)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 13,
    }}>
      <span style={{ color: '#f87171' }}>✕</span>
      <span style={{ color: 'var(--text-muted)', flex: 1 }}>
        Votre dossier KYC a été rejeté. Veuillez resoumettre vos documents.
      </span>
      <Link to="/kyc" style={{ color: '#f87171', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Resoumettre →
      </Link>
    </div>
  )

  // not_submitted
  return (
    <div style={{
      padding: '12px 20px', marginBottom: 24,
      background: 'rgba(201,168,76,0.05)',
      border: '1px solid rgba(201,168,76,0.2)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 13,
    }}>
      <span style={{ color: 'var(--gold)' }}>⚠</span>
      <span style={{ color: 'var(--text-muted)', flex: 1 }}>
        Vérifiez votre identité (KYC) pour accéder à toutes les fonctionnalités.
      </span>
      <Link to="/kyc" style={{
        color: 'var(--gold)', fontSize: 12,
        textDecoration: 'none', whiteSpace: 'nowrap',
        padding: '4px 12px', border: '1px solid var(--gold)',
        transition: 'all .2s',
      }}>
        Vérifier mon identité →
      </Link>
    </div>
  )
}
