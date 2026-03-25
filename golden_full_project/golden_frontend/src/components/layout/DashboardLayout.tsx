// src/components/layout/DashboardLayout.tsx
import { ReactNode, useState, useEffect } from 'react'
import React from 'react'
import { LayoutDashboard, FolderOpen, MessageSquare, DollarSign, User, TrendingUp, Bell, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/ui'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { GoldenLogo } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { useIsMobile } from '@/hooks/useBreakpoint'

interface NavItem {
  icon:   LucideIcon
  label:  string
  to:     string
  badge?: number | string
  badgeColor?: string
}

interface DashboardLayoutProps {
  children:       ReactNode
  navItems:       NavItem[]
  title:          string
  subtitle?:      string
  headerActions?: ReactNode
}

// Bottom nav items porteur
const BOTTOM_NAV_PORTEUR = [
  { icon: LayoutDashboard, label: 'Accueil',   to: '/porteur' },
  { icon: FolderOpen,      label: 'Projet',    to: '/porteur/projet' },
  { icon: MessageSquare,   label: 'Messages',  to: '/porteur/messages' },
  { icon: DollarSign,      label: 'Finances',  to: '/porteur/finances' },
  { icon: User,            label: 'Profil',    to: '/porteur/profil' },
]

const BOTTOM_NAV_INVESTISSEUR = [
  { icon: LayoutDashboard, label: 'Accueil',   to: '/investisseur' },
  { icon: TrendingUp,      label: 'Projets',   to: '/investisseur/projets' },
  { icon: MessageSquare,   label: 'Messages',  to: '/investisseur/messages' },
  { icon: DollarSign,      label: 'Portfolio', to: '/investisseur/portfolio' },
  { icon: User,            label: 'Profil',    to: '/investisseur/profil' },
]

export default function DashboardLayout({
  children, navItems, title, subtitle, headerActions
}: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const isMobile  = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])
  useEffect(() => { if (!isMobile) setSidebarOpen(false) }, [isMobile])

  const handleLogout = async () => { await logout(); navigate('/') }

  const bottomNav = user?.role === 'porteur' ? BOTTOM_NAV_PORTEUR : BOTTOM_NAV_INVESTISSEUR

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>

      {/* Overlay sidebar mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar (desktop + drawer mobile) ─────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <GoldenLogo size="sm" />
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer',
            }}>✕</button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={16} strokeWidth={1.5} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 10,
                  background: item.badgeColor === 'green' ? 'rgba(74,222,128,0.15)' : 'rgba(201,168,76,0.15)',
                  color: item.badgeColor === 'green' ? '#4ade80' : 'var(--gold)',
                }}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            border: '1px solid var(--border-bright)',
            display: 'grid', placeItems: 'center',
            fontSize: 13, color: 'var(--gold)',
          }}>
            {user?.first_name?.[0] ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.full_name ?? user?.email}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {user?.role}
            </div>
          </div>
          <button onClick={handleLogout} style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: 16,
            cursor: 'pointer', padding: 4, transition: 'color .2s',
          }}><LogOut size={15} strokeWidth={1.5} /></button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <div className="dashboard-main" style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 'var(--sidebar-w)',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
        transition: 'margin-left 0.3s ease',
      }}>

        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          padding: isMobile ? '0 16px' : '0 32px',
          height: 'var(--header-h)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer',
              }}>☰</button>
            )}
            <div>
              <h1 style={{ fontSize: isMobile ? 13 : 15, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.02em' }}>
                {title}
              </h1>
              {subtitle && !isMobile && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!isMobile && headerActions}
            <button style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: 18,
              cursor: 'pointer', position: 'relative', padding: 4,
            }}>
              <Bell size={18} strokeWidth={1.5} />
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 7, height: 7,
                background: 'var(--gold)', borderRadius: '50%',
              }} />
            </button>
            {isMobile && (
              <div style={{
                width: 30, height: 30,
                border: '1px solid var(--border-bright)',
                display: 'grid', placeItems: 'center',
                fontSize: 12, color: 'var(--gold)',
              }}>
                {user?.first_name?.[0] ?? '?'}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content" style={{
          flex: 1,
          padding: isMobile ? '16px' : '28px 32px',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: isMobile ? 'calc(var(--bottom-nav-h) + 24px)' : '28px',
        }}>
          {isMobile && headerActions && (
            <div style={{ marginBottom: 14 }}>{headerActions}</div>
          )}
          {children}
        </main>
      </div>

      {/* ── Bottom Navigation (mobile only) ──────── */}
      {isMobile && (
        <nav className="bottom-nav">
          {bottomNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
