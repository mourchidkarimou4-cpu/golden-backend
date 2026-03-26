// src/components/ui/PaymentButton.tsx
import { useState } from 'react'
import { CreditCard, ExternalLink } from 'lucide-react'
import { paymentAPI } from '@/lib/api'
import { toast } from './Toast'

interface PaymentButtonProps {
  investmentId: string
  amount: number
  status: string
  onPaid?: () => void
}

export function PaymentButton({ investmentId, amount, status, onPaid }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const canPay = ['negotiation', 'contract_sent', 'signed'].includes(status)
  const isPaid = ['paid', 'active', 'completed'].includes(status)

  if (isPaid) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, color: '#4ade80',
    }}>
      <CreditCard size={12} strokeWidth={1.5} /> Payé
    </div>
  )

  if (!canPay) return null

  const handlePay = async () => {
    setLoading(true)
    try {
      const { data } = await paymentAPI.init(investmentId)
      if (data.payment_url) {
        toast.info('Redirection vers CinetPay...')
        window.open(data.payment_url, '_blank')
      } else {
        toast.error(data.error || 'Erreur de paiement')
      }
    } catch {
      toast.error('Erreur lors de l\'initialisation du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', background: 'var(--gold)', color: 'var(--dark)',
        border: 'none', fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'inherit',
        opacity: loading ? 0.7 : 1, transition: 'opacity .2s',
      }}
    >
      <CreditCard size={13} strokeWidth={1.5} />
      {loading ? 'Chargement...' : `Payer ${(amount/1_000_000).toFixed(1)}M ₣`}
      {!loading && <ExternalLink size={11} strokeWidth={1.5} />}
    </button>
  )
}
