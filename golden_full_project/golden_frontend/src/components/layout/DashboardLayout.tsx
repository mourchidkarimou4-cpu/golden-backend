// src/components/layout/DashboardLayout.tsx
import { ReactNode, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { useAuth } from '@/lib/auth'

interface NavItem {
  icon:   string
  label:  string
  to:     string
  badge?: number | string
  badgeColor?: string
}

interface DashboardLayoutProps {
  children:  ReactNode
  navItems:  NavItem[]
  title:     string
  subtitle?: string
  headerActions?: ReactNode
}

export default function DashboardLayout({
  children, navItems, title, subtitle, headerActions
}: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <GoldenLogo size="sm" />
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span style={{ fontSize: 16, opacity: 0.7 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 10,
                  background: item.badgeColor === 'green'
                    ? 'rgba(74,222,128,0.15)'
                    : 'rgba(201,168,76,0.15)',
                  color: item.badgeColor === 'green' ? '#4ade80' : 'var(--gold)',
                }}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profil bas de sidebar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 34, height: 34,
            border: '1px solid var(--border-bright)',
            display: 'grid', placeItems: 'center',
            fontSize: 14, color: 'var(--gold)',
            flexShrink: 0,
          }}>
            {user?.first_name?.[0] ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.full_name ?? user?.email}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {user?.role}
            </div>
          </div>
          <button onClick={handleLogout} title="Déconnexion" style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 16, cursor: 'none', padding: 4,
            transition: 'color .2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >⏻</button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          padding: '0 36px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.02em' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {headerActions}
            {/* Notif bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 18,
                cursor: 'none', position: 'relative', padding: 4,
              }}
            >
              🔔
              <span style={{
                position: 'absolute', top: 0, right: 0,
                width: 8, height: 8,
                background: 'var(--gold)', borderRadius: '50%',
              }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {children}
        </main>

      </div>
    </div>
  )
}
