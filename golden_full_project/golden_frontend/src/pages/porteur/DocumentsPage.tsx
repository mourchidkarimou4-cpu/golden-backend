// src/pages/porteur/DocumentsPage.tsx
import { useState, useEffect } from 'react'
import { NAV_PORTEUR, type NavItem } from '@/lib/navItems'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { GoldenSpinner, SectionLabel } from '@/components/ui'
import { projectsAPI } from '@/lib/api'
import { useIsMobile } from '@/hooks/useBreakpoint'


const DOC_TYPES = [
  { label: 'Business Plan', icon: '📄', required: true },
  { label: "Étude de marché", icon: '📊', required: true },
  { label: 'Statuts de la société', icon: '🏛', required: false },
  { label: 'Bilan financier', required: false },
  { label: "Pièce d'identité", required: true },
]

export default function DocumentsPage() {
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    projectsAPI.mine().then(({ data }) => {
      setProjects(data.results ?? data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const mainProject = projects[0]

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !mainProject?.id) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('name', file.name)
    await projectsAPI.addDoc(mainProject.id, form).catch(() => {})
    setUploading(false)
    window.location.reload()
  }

  if (loading) return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Documents">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>← Retour</a>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <a href="/porteur" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>⊞ Accueil</a>
      </div>
      <GoldenSpinner />
    </DashboardLayout>
  )

  return (
    <DashboardLayout navItems={NAV_PORTEUR} title="Documents" subtitle="Gérez les pièces de votre dossier">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        <div className="kpi-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <SectionLabel>Documents soumis</SectionLabel>
            {mainProject && (
              <label style={{ cursor: 'pointer' }}>
                <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
                <span className="btn-gold-sm">{uploading ? 'Envoi...' : '⊕ Ajouter'}</span>
              </label>
            )}
          </div>
          {!mainProject ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Créez d'abord un projet pour gérer ses documents.</p>
          ) : (mainProject.documents ?? []).length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>⊘</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Aucun document ajouté.</p>
            </div>
          ) : (
            (mainProject.documents ?? []).map((doc: any, i: number) => (
              <div key={i} style={{
                padding: '14px 16px', marginBottom: 10,
                background: 'var(--dark-4)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ color: 'var(--gold)', fontSize: 20 }}>⊘</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text)' }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString('fr-FR') : '—'}
                  </div>
                </div>
                <a href={doc.file} target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: 'var(--gold)', textDecoration: 'none' }}>
                  Télécharger →
                </a>
              </div>
            ))
          )}
        </div>
        <div className="kpi-card" style={{ padding: 24 }}>
          <SectionLabel>Documents requis</SectionLabel>
          {DOC_TYPES.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 18 }}></span>
              <span style={{ fontSize: 12, color: 'var(--text)', flex: 1 }}>{d.label}</span>
              {d.required && (
                <span style={{ fontSize: 9, color: '#f87171', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Requis</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
