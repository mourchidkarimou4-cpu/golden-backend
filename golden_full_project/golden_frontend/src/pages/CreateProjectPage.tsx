// src/pages/CreateProjectPage.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { NAV_PORTEUR } from '@/lib/navItems'
import { Check, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { projectsAPI } from '@/lib/api'
import { GoldenLogo, SectionLabel, ProgressBar } from '@/components/ui'

const SECTORS = [
  { value: 'agro',        label: 'Agro-industrie' },
  { value: 'tech',        label: 'Technologie' },
  { value: 'energy',      label: 'Énergie' },
  { value: 'health',      label: 'Santé' },
  { value: 'education',   label: 'Éducation' },
  { value: 'real_estate', label: 'Immobilier' },
  { value: 'transport',   label: 'Transport' },
  { value: 'commerce',    label: 'Commerce' },
  { value: 'finance',     label: 'Finance' },
  { value: 'tourism',     label: 'Tourisme' },
  { value: 'crafts',      label: 'Artisanat' },
  { value: 'other',       label: 'Autre' },
]

const COUNTRIES = ['Bénin', 'Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Togo', 'Niger', 'Guinée', 'Cameroun', 'Autre']

const STEPS = ['Informations générales', 'Finances', 'Récapitulatif']

export default function CreateProjectPage() {
  const navigate = useNavigate()
  const [created, setCreated] = useState<{id: string, title: string} | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isMobile = useIsMobile()
  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    title: '', tagline: '', description: '', sector: 'agro',
    country: 'Bénin', city: '',
    amount_needed: '', roi_estimated: '', duration_months: '',
    min_investment: '', risk_level: 'medium',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const next = () => {
    if (step === 0 && (!form.title || !form.description || !form.sector)) {
      setError('Veuillez remplir tous les champs obligatoires.'); return
    }
    if (step === 1 && (!form.amount_needed || !form.roi_estimated || !form.duration_months)) {
      setError('Veuillez remplir tous les champs financiers.'); return
    }
    setError('')
    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await projectsAPI.create({
        ...form,
        amount_needed:   parseFloat(form.amount_needed) * 1_000_000,
        roi_estimated:   parseFloat(form.roi_estimated),
        duration_months: parseInt(form.duration_months),
        min_investment:  form.min_investment ? parseFloat(form.min_investment) * 1_000_000 : undefined,
      })
      setCreated({ id: data.id, title: data.title })
    } catch (err: any) {
      const d = err.response?.data; setError(typeof d?.detail === 'string' ? d.detail : d?.error ?? JSON.stringify(d) ?? 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitNow = async () => {
    if (!created) return
    setSubmitting(true)
    try {
      await projectsAPI.submit(created.id)
      navigate('/porteur/projet')
    } catch {
      navigate('/porteur/projet')
    } finally {
      setSubmitting(false)
    }
  }

  // Écran de succès
  if (created) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Projet créé">
      <div style={{
        maxWidth: 520, margin: '60px auto', textAlign: 'center', padding: '0 24px',
      }}>
        <div style={{
          width: 64, height: 64, border: '1px solid #4ade80',
          display: 'grid', placeItems: 'center', margin: '0 auto 28px',
          color: '#4ade80',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 12 }}>
          Projet créé avec succès
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
          <strong style={{ color: 'var(--text)' }}>"{created.title}"</strong> a été enregistré en brouillon.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7 }}>
          Vous pouvez le soumettre à validation maintenant ou le retrouver dans "Mon projet".
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleSubmitNow}
            disabled={submitting}
            style={{
              padding: '14px', background: 'var(--gold)', color: 'var(--dark)',
              border: 'none', fontSize: 12, letterSpacing: '.1em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Soumission...' : 'Soumettre à validation →'}
          </button>
          <button
            onClick={() => navigate(`/porteur/projet`)}
            style={{
              padding: '14px', background: 'transparent',
              border: '1px solid var(--border-bright)', color: 'var(--text-muted)',
              fontSize: 12, letterSpacing: '.1em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Voir mon projet
          </button>
          <button
            onClick={() => navigate('/porteur')}
            style={{
              padding: '10px', background: 'none', border: 'none',
              color: 'var(--text-dim)', fontSize: 12, cursor: 'pointer',
            }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </DashboardLayout>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'var(--dark-3)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color .2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--text-muted)', display: 'block', marginBottom: 7,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <GoldenLogo />
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: `1px solid ${i <= step ? 'var(--gold)' : 'var(--border)'}`,
                  background: i < step ? 'var(--gold)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                  fontSize: 11, color: i < step ? 'var(--dark)' : i === step ? 'var(--gold)' : 'var(--text-muted)',
                  fontWeight: 500,
                }}>
                  {i < step ? <Check size={12} strokeWidth={2} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === step ? 'var(--text)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? 'var(--gold)' : 'var(--border)', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Étape 0 : Infos générales ─────────── */}
        {step === 0 && (
          <div>
            <SectionLabel>Étape 1</SectionLabel>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 28 }}>
              Présentez votre projet
            </h2>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Titre du projet *</label>
              <input value={form.title} onChange={set('title')} placeholder="AgroTech Bénin" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Accroche (1 phrase) *</label>
              <input value={form.tagline} onChange={set('tagline')} placeholder="La solution agro-industrielle du Bénin" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description détaillée *</label>
              <textarea value={form.description} onChange={set('description')} rows={5} placeholder="Décrivez votre projet, son marché, son potentiel..." style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Secteur *</label>
                <select value={form.sector} onChange={set('sector')} style={{ ...inputStyle }}>
                  {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Niveau de risque *</label>
                <select value={form.risk_level} onChange={set('risk_level')} style={{ ...inputStyle }}>
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Pays *</label>
                <select value={form.country} onChange={set('country')} style={{ ...inputStyle }}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ville</label>
                <input value={form.city} onChange={set('city')} placeholder="Cotonou" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 1 : Finances ────────────────── */}
        {step === 1 && (
          <div>
            <SectionLabel>Étape 2</SectionLabel>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 28 }}>
              Définissez votre financement
            </h2>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Montant recherché (millions FCFA) *</label>
              <input type="number" value={form.amount_needed} onChange={set('amount_needed')} placeholder="Ex : 250" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>ROI estimé (%) *</label>
                <input type="number" value={form.roi_estimated} onChange={set('roi_estimated')} placeholder="Ex : 18" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label style={labelStyle}>Durée (mois) *</label>
                <input type="number" value={form.duration_months} onChange={set('duration_months')} placeholder="Ex : 36" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Investissement minimum par investisseur (millions FCFA)</label>
              <input type="number" value={form.min_investment} onChange={set('min_investment')} placeholder="Ex : 5 (optionnel)" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* Preview financier */}
            {form.amount_needed && form.roi_estimated && (
              <div style={{
                padding: 20, background: 'rgba(201,168,76,0.05)',
                border: '1px solid var(--border)', marginBottom: 8,
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Aperçu</div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
                  {[
                    { label: 'Recherché', value: `${form.amount_needed}M ₣` },
                    { label: 'ROI estimé', value: `${form.roi_estimated}%` },
                    { label: 'Retour prévu', value: `${(parseFloat(form.amount_needed) * parseFloat(form.roi_estimated) / 100).toFixed(1)}M ₣` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: 'var(--text)', marginTop: 3 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Étape 2 : Récapitulatif ───────────── */}
        {step === 2 && (
          <div>
            <SectionLabel>Récapitulatif</SectionLabel>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 28 }}>
              Vérifiez votre projet
            </h2>
            {[
              { label: 'Titre',      value: form.title },
              { label: 'Secteur',    value: SECTORS.find(s => s.value === form.sector)?.label },
              { label: 'Pays',       value: `${form.country}${form.city ? ` · ${form.city}` : ''}` },
              { label: 'Montant',    value: `${form.amount_needed}M FCFA` },
              { label: 'ROI estimé', value: `${form.roi_estimated}%` },
              { label: 'Durée',      value: `${form.duration_months} mois` },
              { label: 'Risque',     value: form.risk_level === 'low' ? 'Faible' : form.risk_level === 'medium' ? 'Moyen' : 'Élevé' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid var(--border)',
                fontSize: 13,
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ color: 'var(--text)' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ padding: '16px', marginTop: 20, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', fontSize: 12, color: '#fbbf24', lineHeight: 1.6 }}>
              Votre projet sera soumis en mode brouillon. Il ne sera visible par les investisseurs qu'après validation par notre équipe.
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && <p style={{ fontSize: 12, color: '#f87171', margin: '16px 0' }}>{error}</p>}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-outline"
              style={{ flex: 1, padding: '14px 0', fontSize: 12 }}>
              ← Retour
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary"
              style={{ flex: 1, padding: '14px 0', fontSize: 12 }}>
              Continuer →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary"
              style={{ flex: 1, padding: '14px 0', fontSize: 12, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Création...' : 'Créer le projet'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
