// src/components/ui/NegotiationFlow.tsx
import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface NegotiationStep {
  label: string
  status: 'done' | 'active' | 'pending' | 'cancelled'
  date?: string
  note?: string
}

interface NegotiationFlowProps {
  investmentId: string
  investorName?: string
  amount: number
  status: string
  createdAt?: string
  steps?: NegotiationStep[]
}

const STATUS_STEPS: Record<string, NegotiationStep[]> = {
  pending: [
    { label: 'Demande reçue',       status: 'done',    date: 'Aujourd\'hui' },
    { label: 'Analyse en cours',    status: 'active' },
    { label: 'Négociation',         status: 'pending' },
    { label: 'Contrat signé',       status: 'pending' },
    { label: 'Fonds transférés',    status: 'pending' },
  ],
  confirmed: [
    { label: 'Demande reçue',       status: 'done' },
    { label: 'Analyse effectuée',   status: 'done' },
    { label: 'Négociation terminée',status: 'done' },
    { label: 'Contrat signé',       status: 'active' },
    { label: 'Fonds transférés',    status: 'pending' },
  ],
  completed: [
    { label: 'Demande reçue',       status: 'done' },
    { label: 'Analyse effectuée',   status: 'done' },
    { label: 'Négociation terminée',status: 'done' },
    { label: 'Contrat signé',       status: 'done' },
    { label: 'Fonds transférés',    status: 'done' },
  ],
  cancelled: [
    { label: 'Demande reçue',       status: 'done' },
    { label: 'Annulée',             status: 'cancelled' },
  ],
}

const STEP_ICON = {
  done:      <CheckCircle size={14} strokeWidth={1.5} color="#4ade80" />,
  active:    <Clock       size={14} strokeWidth={1.5} color="var(--gold)" />,
  pending:   <AlertCircle size={14} strokeWidth={1.5} color="var(--text-dim)" />,
  cancelled: <XCircle     size={14} strokeWidth={1.5} color="#f87171" />,
}

export function NegotiationFlow({ investmentId, investorName, amount, status, createdAt }: NegotiationFlowProps) {
  const [open, setOpen] = useState(false)
  const steps = STATUS_STEPS[status] ?? STATUS_STEPS['pending']

  const handleDownload = () => {
    const content = `CONTRAT D'INVESTISSEMENT GOLDEN\n\nInvestisseur : ${investorName ?? '—'}\nMontant : ${(amount/1_000_000).toFixed(1)}M FCFA\nStatut : ${status}\nDate : ${createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : '—'}\n\nCe document est généré automatiquement par GOLDEN Investissement.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contrat_${investmentId.slice(0,8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ border: '1px solid var(--border)', marginBottom: 8 }}>
      {/* Header cliquable */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '12px 16px',
          background: 'var(--dark-4)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', color: 'var(--text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{investorName ?? 'Investisseur'}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              {(amount/1_000_000).toFixed(1)}M FCFA · {status}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {open ? 'Masquer' : 'Détails'}
          </span>
          {open ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
        </div>
      </button>

      {/* Contenu dépliable */}
      {open && (
        <div style={{ padding: '16px 20px' }}>
          {/* Steps */}
          <div style={{ marginBottom: 20 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ marginTop: 1, flexShrink: 0 }}>{STEP_ICON[step.status]}</div>
                <div>
                  <div style={{ fontSize: 12, color: step.status === 'pending' ? 'var(--text-dim)' : 'var(--text)' }}>
                    {step.label}
                  </div>
                  {step.date && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{step.date}</div>}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: 27, marginTop: 20, width: 1, height: 12, background: 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Bouton télécharger contrat */}
          {(status === 'confirmed' || status === 'completed') && (
            <button
              onClick={handleDownload}
              className="btn-gold-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Download size={12} strokeWidth={1.5} /> Télécharger le contrat
            </button>
          )}
        </div>
      )}
    </div>
  )
}
