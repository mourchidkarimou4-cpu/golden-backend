// src/pages/porteur/MonProjetPage.tsx
import { useState, useEffect } from 'react'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import { useNavigate } from 'react-router-dom'
import { Share2, Pencil } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { StatusBadge, GoldenSpinner, ProgressBar, SectionLabel } from '@/components/ui'
import { projectsAPI } from '@/lib/api'


export default function MonProjetPage() {
  const navigate = useNavigate()
  const [sharing, setSharing] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    projectsAPI.mine().then(({ data }) => {
      const list = data.results ?? data ?? []
      setProjects(list)
      if (list.length > 0) setSelected(list[0])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Mon Projet">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <GoldenSpinner />
    </DashboardLayout>
  )

  const handleShare = async () => {
    if (!selected?.id) return
    setSharing(true)
    try {
      const { data } = await projectsAPI.createShareToken(selected.id)
      await navigator.clipboard.writeText(data.url)
      setShareMsg('Lien copié ! Valable 72h.')
      setTimeout(() => setShareMsg(''), 3000)
    } catch {
      setShareMsg('Erreur lors du partage.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Mon Projet" subtitle="Gérez et suivez votre projet"
      headerActions={<button className="btn-gold-sm" onClick={() => navigate('/porteur/nouveau')}>⊕ Nouveau projet</button>}
    >
      {projects.length === 0 ? (
        <div className="kpi-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>◈</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Vous n'avez pas encore de projet soumis.</p>
          <button className="btn-primary" onClick={() => navigate('/porteur/nouveau')}>Créer mon premier projet →</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="kpi-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 300, marginBottom: 8 }}>{selected?.title}</h2>
                  <StatusBadge status={selected?.status} label={selected?.status_label ?? selected?.status} />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {shareMsg && <span style={{ fontSize: 11, color: '#4ade80' }}>{shareMsg}</span>}
                  <button className="btn-gold-sm" onClick={handleShare} disabled={sharing} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Share2 size={12} strokeWidth={1.5} /> {sharing ? '...' : 'Partager'}
                  </button>
                  <button className="btn-gold-sm" onClick={() => navigate('/porteur/nouveau')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Pencil size={12} strokeWidth={1.5} /> Modifier
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>{selected?.description ?? selected?.tagline ?? 'Aucune description.'}</p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progression</span>
                  <span style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 500 }}>{selected?.funding_percentage ?? 0}%</span>
                </div>
                <ProgressBar value={selected?.funding_percentage ?? 0} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{((selected?.amount_raised ?? 0)/1_000_000).toFixed(1)}M FCFA levés</span>
                  <span>Objectif : {((selected?.amount_needed ?? 0)/1_000_000).toFixed(1)}M FCFA</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Secteur', value: selected?.sector ?? '—' },
                  { label: 'Pays', value: selected?.country ?? '—' },
                  { label: 'ROI estimé', value: `${selected?.roi_estimated ?? 0}%` },
                  { label: 'Durée', value: `${selected?.duration_months ?? 0} mois` },
                ].map(s => (
                  <div key={s.label} style={{ padding: 14, background: 'var(--dark-4)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, color: 'var(--text)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="kpi-card" style={{ padding: 24 }}>
              <SectionLabel>Statistiques</SectionLabel>
              {[
                { label: 'Vues totales', value: selected?.views ?? 0 },
                { label: 'En favoris', value: selected?.favorites_count ?? 0 },
                { label: 'Investissements', value: selected?.investment_count ?? 0 },
                { label: 'Risque', value: selected?.risk_level ?? '—' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}></span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="kpi-card" style={{ padding: 24 }}>
              <SectionLabel>Actions</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <button className="btn-gold-sm" style={{ justifyContent: 'center' }} onClick={() => projectsAPI.submit(selected?.id).then(() => alert('Projet soumis !'))}>▶ Soumettre à validation</button>
                <button className="btn-gold-sm" style={{ justifyContent: 'center' }} onClick={() => navigate('/porteur/documents')}>⊘ Gérer les documents</button>
                <button className="btn-gold-sm" style={{ justifyContent: 'center' }} onClick={() => navigate('/porteur/messages')}>✉ Contacter un investisseur</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
