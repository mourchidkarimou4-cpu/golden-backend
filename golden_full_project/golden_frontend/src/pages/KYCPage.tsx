// src/pages/KYCPage.tsx
import { useState , useRef} from 'react'
import { CheckCircle, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { GoldenLogo, SectionLabel } from '@/components/ui'

const DOC_TYPES = [
  { value: 'id_card',       label: 'Carte nationale d\'identité' },
  { value: 'passport',      label: 'Passeport' },
  { value: 'selfie',        label: 'Selfie avec pièce d\'identité' },
  { value: 'proof_address', label: 'Justificatif de domicile' },
  { value: 'business_reg',  label: 'Registre de commerce (entreprises)' },
]

export default function KYCPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [uploads, setUploads]   = useState<{ type: string; file: File | null }[]>([
    { type: 'id_card', file: null },
    { type: 'selfie',  file: null },
  ])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const addDoc = () => setUploads(prev => [...prev, { type: 'proof_address', file: null }])
  const removeDoc = (i: number) => setUploads(prev => prev.filter((_, idx) => idx !== i))

  const setType = (i: number, type: string) =>
    setUploads(prev => prev.map((u, idx) => idx === i ? { ...u, type } : u))

  const setFile = (i: number, file: File | null) =>
    setUploads(prev => prev.map((u, idx) => idx === i ? { ...u, file } : u))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hasFiles = uploads.every(u => u.file !== null)
    if (!hasFiles) { setError('Veuillez joindre tous les documents requis.'); return }

    setLoading(true); setError('')
    try {
      for (const upload of uploads) {
        if (!upload.file) continue
        const fd = new FormData()
        fd.append('doc_type', upload.type)
        fd.append('file', upload.file)
        await authAPI.kycSubmit(fd)
      }
      setSuccess(true)
      setTimeout(() => navigate(user?.role === 'porteur' ? '/porteur' : '/investisseur'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <CheckCircle size={48} strokeWidth={1.5} color='#4ade80' style={{ marginBottom: 20 }} />
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 12 }}>
          Documents soumis avec succès
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Notre équipe vérifie votre dossier sous 24-48h. Redirection en cours...
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <GoldenLogo />
          <button onClick={() => navigate(-1 as any)} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 12, cursor: 'pointer', letterSpacing: '.08em',
            textTransform: 'uppercase', fontFamily: 'inherit',
          }}>← Retour</button>
        </div>

        <SectionLabel>Vérification KYC</SectionLabel>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 32, fontWeight: 300, marginBottom: 12 }}>
          Vérifiez votre identité
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7 }}>
          Pour accéder à toutes les fonctionnalités de la plateforme, nous devons vérifier votre identité.
          Vos documents sont chiffrés et stockés en toute sécurité.
        </p>

        {/* Statut actuel */}
        <div style={{
          padding: '14px 20px', marginBottom: 32,
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13,
        }}>
          <span style={{ color: 'var(--gold)' }}>◈</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Statut actuel : <span style={{ color: 'var(--text)' }}>
              {user?.kyc_status === 'not_submitted' ? 'Non soumis'
               : user?.kyc_status === 'pending' ? 'En attente de validation'
               : user?.kyc_status === 'approved' ? 'Validé'
               : 'Rejeté'}
            </span>
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {uploads.map((upload, i) => (
            <div key={i} style={{
              marginBottom: 20, padding: 20,
              background: 'var(--dark-3)',
              border: '1px solid var(--border)',
              position: 'relative',
            }}>
              {i >= 2 && (
                <button type="button" onClick={() => removeDoc(i)} style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: 16, cursor: 'none',
                }}>✕</button>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Type de document</label>
                <select
                  value={upload.type}
                  onChange={e => setType(i, e.target.value)}
                  style={selectStyle}
                >
                  {DOC_TYPES.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Fichier (JPG, PNG ou PDF — max 5 Mo)</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  padding: '24px 16px', textAlign: 'center',
                  transition: 'border-color .2s', cursor: 'none',
                  position: 'relative',
                }}
                  onDragOver={e => { e.preventDefault(); (e.currentTarget.style.borderColor = 'var(--gold)') }}
                  onDragLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  onDrop={e => {
                    e.preventDefault()
                    const f = e.dataTransfer.files[0]
                    if (f) setFile(i, f)
                    ;(e.currentTarget.style.borderColor = 'var(--border)')
                  }}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => setFile(i, e.target.files?.[0] ?? null)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'none', width: '100%', height: '100%' }}
                  />
                  {upload.file ? (
                    <div>
                      <CheckCircle size={20} strokeWidth={1.5} color='#4ade80' style={{ marginBottom: 6 }} />
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{upload.file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {(upload.file.size / 1024).toFixed(0)} Ko
                      </div>
                    </div>
                  ) : (
                    <>
                      <Plus size={24} strokeWidth={1.5} style={{ color: 'var(--text-muted)', marginBottom: 8, opacity: 0.5 }} />
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Glisser-déposer ou <span style={{ color: 'var(--gold)' }}>parcourir</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Ajouter un document */}
          <button
            type="button"
            onClick={addDoc}
            style={{
              width: '100%', padding: '12px 0',
              background: 'transparent',
              border: '1px dashed var(--border)',
              color: 'var(--text-muted)', fontSize: 12,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'none', marginBottom: 28,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--border-bright)'); (e.currentTarget.style.color = 'var(--text)') }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); (e.currentTarget.style.color = 'var(--text-muted)') }}
          >
            + Ajouter un document
          </button>

          {error && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px 0', fontSize: 12, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre mon dossier KYC'}
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            Vos documents sont chiffrés et traités sous 24-48h.<br/>
            Nous ne partageons jamais vos informations personnelles.
          </p>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'var(--text-muted)', display: 'block', marginBottom: 7,
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: 'var(--dark-4)',
  border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 13, outline: 'none',
  fontFamily: 'inherit',
}
