// src/components/dashboard/InvestModal.tsx
import { useState } from 'react'
import { investmentsAPI } from '@/lib/api'

interface InvestModalProps {
  project:   any
  onClose:   () => void
  onSuccess: () => void
}

export default function InvestModal({ project, onClose, onSuccess }: InvestModalProps) {
  const [amount, setAmount]   = useState('')
  const [method, setMethod]   = useState('mobile_money')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const roiSimul = amount
    ? ((parseFloat(amount) * project.roi_estimated) / 100).toFixed(0)
    : '0'

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Veuillez entrer un montant valide.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await investmentsAPI.create({
        project: project.id,
        amount: parseFloat(amount) * 1_000_000,
        payment_method: method,
        notes,
      })
      onSuccess()
    } catch (e: any) {
      setError(e.response?.data?.detail ?? e.response?.data?.amount?.[0] ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'var(--dark-2)',
        border: '1px solid var(--border-bright)',
        padding: 36,
        position: 'relative',
        animation: 'fadeUp .3s ease',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: 18, cursor: 'none',
          }}
        >✕</button>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
            Investissement
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 24, fontWeight: 300 }}>
            {project.title}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            ROI estimé : {project.roi_estimated}% · Durée : {project.duration_months} mois
          </p>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 7 }}>
            Montant (en millions FCFA)
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Ex : 5"
            style={{
              width: '100%', padding: '12px 14px',
              background: 'var(--dark-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 14,
              outline: 'none', transition: 'border-color .2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />
          {project.min_investment && (
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              Minimum : {(project.min_investment / 1_000_000).toFixed(0)}M FCFA
            </p>
          )}
        </div>

        {/* Payment method */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 7 }}>
            Mode de paiement
          </label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              background: 'var(--dark-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 14, outline: 'none',
            }}
          >
            <option value="mobile_money">Mobile Money (MTN / Orange)</option>
            <option value="bank_transfer">Virement bancaire</option>
            <option value="escrow">Séquestre GOLDEN</option>
          </select>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 7 }}>
            Message au porteur (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Vos conditions ou questions..."
            style={{
              width: '100%', padding: '12px 14px',
              background: 'var(--dark-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 13,
              outline: 'none', resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* ROI Simulation */}
        {amount && parseFloat(amount) > 0 && (
          <div style={{
            padding: 16, marginBottom: 20,
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Montant investi</div>
                <div style={{ fontSize: 18, fontFamily: '"Cormorant Garamond", serif', color: 'var(--text)', marginTop: 3 }}>
                  {amount}M ₣
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Gain estimé</div>
                <div style={{ fontSize: 18, fontFamily: '"Cormorant Garamond", serif', color: '#4ade80', marginTop: 3 }}>
                  +{roiSimul}M ₣
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ flex: 1, padding: '12px 0', fontSize: 12 }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
            style={{ flex: 1, padding: '12px 0', fontSize: 12, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Envoi...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}
