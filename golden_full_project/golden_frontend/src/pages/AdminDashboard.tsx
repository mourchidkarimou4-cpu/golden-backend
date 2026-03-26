// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { reportingAPI } from '@/lib/api'
import { GoldenLogo, GoldenSpinner, SectionLabel } from '@/components/ui'
import { toast } from '@/components/ui'
import { Users, FolderOpen, TrendingUp, AlertTriangle, CheckCircle, XCircle, LogOut } from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [kycList, setKycList] = useState<any[]>([])
  const [projectList, setProjectList] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "projects">("overview")

  useEffect(() => {
    if (user && !(user as any).is_staff && !(user as any).is_superuser && user.role !== 'admin') {
      navigate("/")
      return
    }
    Promise.all([
      reportingAPI.dashboardAdmin(),
      api.get("/users/kyc/pending/").catch(() => ({ data: [] })),
      api.get("/projects/?status=pending_review").catch(() => ({ data: { results: [] } })),
    ]).then(([dash, kyc, proj]) => {
      setData(dash.data)
      setKycList(kyc.data.results ?? kyc.data ?? [])
      setProjectList(proj.data.results ?? proj.data ?? [])
    }).finally(() => setLoading(false))
  }, [user])

  const handleKYC = async (userId: string, action: "approve" | "reject") => {
    try {
      await api.post(`/users/${userId}/kyc/${action}/`)
      toast.success(action === "approve" ? "KYC approuvé !" : "KYC rejeté.")
      setKycList(prev => prev.filter(u => u.id !== userId))
      setData((d: any) => ({
        ...d,
        users: { ...d.users, pending_kyc: d.users.pending_kyc - 1 },
        alerts: { ...d.alerts, pending_kyc: d.alerts.pending_kyc - 1 },
      }))
    } catch { toast.error("Erreur lors de l\'action KYC.") }
  }

  const handleProject = async (projectId: string, action: "approve" | "reject") => {
    try {
      await api.post(`/projects/${projectId}/${action === "approve" ? "activate" : "reject"}/`)
      toast.success(action === "approve" ? "Projet activé !" : "Projet rejeté.")
      setProjectList(prev => prev.filter(p => p.id !== projectId))
      setData((d: any) => ({
        ...d,
        projects: { ...d.projects, pending_review: d.projects.pending_review - 1 },
        alerts: { ...d.alerts, pending_projects: d.alerts.pending_projects - 1 },
      }))
    } catch { toast.error("Erreur lors de l\'action projet.") }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", display: "grid", placeItems: "center" }}>
      <GoldenSpinner />
    </div>
  )

  const kpis = [
    { label: "Utilisateurs", value: data?.users?.total ?? 0, sub: `${data?.users?.porteurs ?? 0} porteurs · ${data?.users?.investisseurs ?? 0} investisseurs`, Icon: Users, color: "var(--text)" },
    { label: "Projets actifs", value: data?.projects?.active ?? 0, sub: `${data?.projects?.pending_review ?? 0} en attente`, Icon: FolderOpen, color: "#4ade80" },
    { label: "Capital mobilisé", value: `${((data?.investments?.total_capital ?? 0)/1_000_000).toFixed(0)}M`, sub: `${data?.investments?.total ?? 0} investissements`, Icon: TrendingUp, color: "var(--gold)" },
    { label: "KYC en attente", value: data?.alerts?.pending_kyc ?? 0, sub: `${data?.alerts?.pending_projects ?? 0} projets à valider`, Icon: AlertTriangle, color: data?.alerts?.pending_kyc > 0 ? "#fbbf24" : "var(--text-muted)" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)" }}>
      {/* Header */}
      <header style={{
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <GoldenLogo size="sm" />
          <span style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Administration
          </span>
        </div>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "var(--text-muted)",
          cursor: "pointer", fontSize: 12,
        }}>
          <LogOut size={14} strokeWidth={1.5} /> Déconnexion
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
          {kpis.map(k => (
            <div key={k.label} className="kpi-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{k.label}</span>
                <k.Icon size={16} strokeWidth={1.5} color={k.color} />
              </div>
              <div style={{ fontFamily: "\"Cormorant Garamond\", serif", fontSize: 32, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
          {(["overview", "kyc", "projects"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 24px", fontSize: 11, letterSpacing: ".1em",
              textTransform: "uppercase", background: "none", border: "none",
              borderBottom: activeTab === tab ? "1px solid var(--gold)" : "1px solid transparent",
              color: activeTab === tab ? "var(--gold)" : "var(--text-muted)",
              cursor: "pointer", marginBottom: -1, transition: "color .2s",
            }}>
              {tab === "overview" ? "Vue d\'ensemble" : tab === "kyc" ? `KYC (${kycList.length})` : `Projets (${projectList.length})`}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="kpi-card" style={{ padding: 24 }}>
              <SectionLabel>Utilisateurs</SectionLabel>
              {[
                { label: "Total", value: data?.users?.total ?? 0 },
                { label: "KYC vérifiés", value: data?.users?.kyc_verified ?? 0 },
                { label: "KYC en attente", value: data?.users?.pending_kyc ?? 0 },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="kpi-card" style={{ padding: 24 }}>
              <SectionLabel>Projets & Investissements</SectionLabel>
              {[
                { label: "Projets total", value: data?.projects?.total ?? 0 },
                { label: "Projets actifs", value: data?.projects?.active ?? 0 },
                { label: "En attente validation", value: data?.projects?.pending_review ?? 0 },
                { label: "Investissements total", value: data?.investments?.total ?? 0 },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KYC */}
        {activeTab === "kyc" && (
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>KYC en attente de validation</SectionLabel>
            {kycList.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                Aucun KYC en attente
              </div>
            ) : kycList.map((u: any) => (
              <div key={u.id} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{u.full_name ?? u.email}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{u.email} · {u.role}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleKYC(u.id, "approve")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80",
                    fontSize: 11, cursor: "pointer",
                  }}><CheckCircle size={12} strokeWidth={1.5} /> Approuver</button>
                  <button onClick={() => handleKYC(u.id, "reject")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.3)", color: "#f87171",
                    fontSize: 11, cursor: "pointer",
                  }}><XCircle size={12} strokeWidth={1.5} /> Rejeter</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="kpi-card" style={{ padding: 24 }}>
            <SectionLabel>Projets en attente de validation</SectionLabel>
            {projectList.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                Aucun projet en attente
              </div>
            ) : projectList.map((p: any) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {p.sector} · {((p.amount_needed ?? 0)/1_000_000).toFixed(0)}M FCFA · {p.owner_name ?? p.owner}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleProject(p.id, "approve")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80",
                    fontSize: 11, cursor: "pointer",
                  }}><CheckCircle size={12} strokeWidth={1.5} /> Activer</button>
                  <button onClick={() => handleProject(p.id, "reject")} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.3)", color: "#f87171",
                    fontSize: 11, cursor: "pointer",
                  }}><XCircle size={12} strokeWidth={1.5} /> Rejeter</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
