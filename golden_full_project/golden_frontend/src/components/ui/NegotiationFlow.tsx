// src/components/ui/NegotiationFlow.tsx
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Download, CheckCircle, Clock, XCircle, AlertCircle, Send, RefreshCw } from 'lucide-react'
import { investmentsAPI } from '@/lib/api'
import { toast } from '@/components/ui'
import { useAuth } from '@/lib/auth'

interface NegotiationFlowProps {
  investmentId: string
  investorName?: string
  amount: number
  status: string
  createdAt?: string
  projectOwnerId?: string
}

const STEP_ICON: Record<string, any> = {
  done:      <CheckCircle size={14} strokeWidth={1.5} color="#4ade80" />,
  active:    <Clock       size={14} strokeWidth={1.5} color="var(--gold)" />,
  pending:   <AlertCircle size={14} strokeWidth={1.5} color="var(--text-dim)" />,
  cancelled: <XCircle     size={14} strokeWidth={1.5} color="#f87171" />,
}

const STATUS_STEPS: Record<string, {label: string; status: string}[]> = {
  negotiation:     [{label:'Proposition',status:'done'},{label:'Négociation',status:'active'},{label:'Accord',status:'pending'},{label:'Contrat',status:'pending'},{label:'Paiement',status:'pending'}],
  contract_sent:   [{label:'Proposition',status:'done'},{label:'Négociation',status:'done'},{label:'Accord',status:'done'},{label:'Contrat envoyé',status:'active'},{label:'Paiement',status:'pending'}],
  signed:          [{label:'Proposition',status:'done'},{label:'Négociation',status:'done'},{label:'Accord',status:'done'},{label:'Contrat signé',status:'done'},{label:'Paiement',status:'pending'}],
  paid:            [{label:'Proposition',status:'done'},{label:'Négociation',status:'done'},{label:'Accord',status:'done'},{label:'Contrat',status:'done'},{label:'Payé',status:'done'}],
  cancelled:       [{label:'Proposition',status:'done'},{label:'Annulé',status:'cancelled'}],
}

export function NegotiationFlow({ investmentId, investorName, amount, status, createdAt, projectOwnerId }: NegotiationFlowProps) {
  const { user } = useAuth()
  const [open, setOpen]           = useState(false)
  const [offers, setOffers]       = useState<any[]>([])
  const [showForm, setShowForm]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [form, setForm]           = useState({ amount: '', roi: '', duration: '', message: '', offer_type: 'counter' })

  const isPorteur = user?.role === 'porteur'
  const steps = STATUS_STEPS[status] ?? STATUS_STEPS['negotiation']

  const loadOffers = async () => {
    try {
      const { data } = await investmentsAPI.getOffers(investmentId)
      setOffers(data)
    } catch {}
  }

  useEffect(() => { if (open) loadOffers() }, [open])

  const handleOffer = async (offerType: string) => {
    setLoading(true)
    try {
      await investmentsAPI.makeOffer(investmentId, {
        offer_type: offerType,
        amount: form.amount ? parseFloat(form.amount) * 1_000_000 : undefined,
        roi: form.roi ? parseFloat(form.roi) : undefined,
        duration: form.duration ? parseInt(form.duration) : undefined,
        message: form.message,
      })
      toast.success(offerType === 'accepted' ? 'Offre acceptée !' : offerType === 'rejected' ? 'Offre rejetée.' : 'Contre-offre envoyée !')
      setShowForm(false)
      setForm({ amount: '', roi: '', duration: '', message: '', offer_type: 'counter' })
      loadOffers()
    } catch {
      toast.error('Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const content = `CONTRAT D'INVESTISSEMENT GOLDEN\n\nInvestisseur : ${investorName ?? '—'}\nMontant : ${(amount/1_000_000).toFixed(1)}M FCFA\nStatut : ${status}\nDate : ${createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : '—'}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `contrat_${investmentId.slice(0,8)}.txt`; a.click()
    URL.revokeObjectURL(url)
    toast.success('Contrat téléchargé')
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '8px 12px',
    background: 'var(--dark-3)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 12, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ border: '1px solid var(--border)', marginBottom: 8 }}>
      {/* Header */}
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '12px 16px', background: 'var(--dark-4)',
        border: 'none', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text)',
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>{investorName ?? 'Investisseur'}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {(amount/1_000_000).toFixed(1)}M FCFA · {status}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{open ? 'Masquer' : 'Détails'}</span>
          {open ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
        </div>
      </button>

      {open && (
        <div style={{ padding: '16px 20px' }}>
          {/* Timeline */}
          <div style={{ marginBottom: 20 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
                {STEP_ICON[step.status]}
                <span style={{ fontSize: 12, color: step.status === 'pending' ? 'var(--text-dim)' : 'var(--text)' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Historique offres */}
          {offers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                Historique des offres
              </div>
              {offers.map((o: any) => (
                <div key={o.id} style={{
                  padding: '10px 12px', marginBottom: 6,
                  background: 'var(--dark-3)', border: '1px solid var(--border)',
                  borderLeft: `2px solid ${o.offer_type === 'accepted' ? '#4ade80' : o.offer_type === 'rejected' ? '#f87171' : 'var(--gold)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{o.made_by_name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {o.amount && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Montant : {(parseFloat(o.amount)/1_000_000).toFixed(1)}M FCFA</div>}
                  {o.roi && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ROI : {o.roi}%</div>}
                  {o.message && <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 4 }}>{o.message}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Actions porteur */}
          {isPorteur && status === 'negotiation' && !showForm && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => handleOffer('accepted')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80',
                fontSize: 11, cursor: 'pointer',
              }}>
                <CheckCircle size={12} strokeWidth={1.5} /> Accepter
              </button>
              <button onClick={() => { setShowForm(true); setForm(f => ({...f, offer_type: 'counter'})) }} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'rgba(184,115,51,0.1)',
                border: '1px solid var(--border-bright)', color: 'var(--gold)',
                fontSize: 11, cursor: 'pointer',
              }}>
                <RefreshCw size={12} strokeWidth={1.5} /> Contre-offre
              </button>
              <button onClick={() => handleOffer('rejected')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)', color: '#f87171',
                fontSize: 11, cursor: 'pointer',
              }}>
                <XCircle size={12} strokeWidth={1.5} /> Refuser
              </button>
            </div>
          )}

          {/* Formulaire contre-offre */}
          {showForm && (
            <div style={{ marginTop: 12, padding: 16, background: 'var(--dark-3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Contre-offre
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>Montant (M FCFA)</div>
                  <input value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} style={inp} placeholder="Ex: 50" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>ROI (%)</div>
                  <input value={form.roi} onChange={e => setForm(f => ({...f, roi: e.target.value}))} style={inp} placeholder="Ex: 15" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>Durée (mois)</div>
                  <input value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} style={inp} placeholder="Ex: 24" />
                </div>
              </div>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({...f, message: e.target.value}))}
                placeholder="Message accompagnant la contre-offre..."
                rows={2}
                style={{ ...inp, resize: 'none', marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleOffer('counter')} disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', background: 'var(--gold)', color: 'var(--dark)',
                  border: 'none', fontSize: 11, cursor: 'pointer',
                }}>
                  <Send size={12} strokeWidth={1.5} /> {loading ? '...' : 'Envoyer'}
                </button>
                <button onClick={() => setShowForm(false)} style={{
                  padding: '8px 16px', background: 'none',
                  border: '1px solid var(--border)', color: 'var(--text-muted)',
                  fontSize: 11, cursor: 'pointer',
                }}>Annuler</button>
              </div>
            </div>
          )}

          {/* Télécharger contrat */}
          {(status === 'contract_sent' || status === 'signed' || status === 'paid' || status === 'completed') && (
            <button onClick={handleDownload} className="btn-gold-sm" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <Download size={12} strokeWidth={1.5} /> Télécharger le contrat
            </button>
          )}
        </div>
      )}
    </div>
  )
}
