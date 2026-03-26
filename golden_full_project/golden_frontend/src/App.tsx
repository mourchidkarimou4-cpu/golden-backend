// src/App.tsx
import { useState, useCallback, useEffect } from 'react'
import NotFoundPage from '@/pages/NotFoundPage'

function AnimatedOutlet({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div
      key={location.pathname}
      style={{
        animation: 'fadeUp 0.35s ease both',
      }}
    >
      {children}
    </div>
  )
}
import AdminDashboard from '@/pages/AdminDashboard'
import SplashScreen from '@/components/ui/SplashScreen'

import SharePage from '@/pages/SharePage'
import { BrowserRouter, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'

import LandingPage           from '@/pages/LandingPage'
import LoginPage             from '@/pages/LoginPage'
import RegisterPage          from '@/pages/RegisterPage'
import KYCPage               from '@/pages/KYCPage'
import DashboardPorteur      from '@/pages/DashboardPorteur'
import DashboardInvestisseur from '@/pages/DashboardInvestisseur'
import MessagesPage          from '@/pages/MessagesPage'
import CreateProjectPage     from '@/pages/CreateProjectPage'
import AboutPage             from '@/pages/AboutPage'
import ProjectsPublicPage    from '@/pages/ProjectsPublicPage'

import MonProjetPage         from '@/pages/porteur/MonProjetPage'
import InvestisseursPage     from '@/pages/porteur/InvestisseursPage'
import ActivitePage          from '@/pages/porteur/ActivitePage'
import DocumentsPage         from '@/pages/porteur/DocumentsPage'
import FinancesPage          from '@/pages/porteur/FinancesPage'
import RapportsPagePorteur   from '@/pages/porteur/RapportsPage'
import ProfilPagePorteur     from '@/pages/porteur/ProfilPage'
import ParametresPagePorteur from '@/pages/porteur/ParametresPage'

import ProjetsPage           from '@/pages/investisseur/ProjetsPage'
import PortfolioPage         from '@/pages/investisseur/PortfolioPage'
import FavorisPage           from '@/pages/investisseur/FavorisPage'
import RapportsPageInv       from '@/pages/investisseur/RapportsPage'
import ProfilPageInv         from '@/pages/investisseur/ProfilPage'
import ParametresPageInv     from '@/pages/investisseur/ParametresPage'

function PrivateRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ background: 'var(--dark)', minHeight: '100vh' }} />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role)
    return <Navigate to={user.role === 'porteur' ? '/porteur' : '/investisseur'} replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'porteur' ? '/porteur' : '/investisseur'} replace />
  return <>{children}</>
}

function AppRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} style={{ animation: 'fadeUp 0.35s ease both' }}>
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/about"     element={<AboutPage />} />
      <Route path="/projets"    element={<ProjectsPublicPage />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/kyc"      element={<PrivateRoute><KYCPage /></PrivateRoute>} />

      <Route path="/porteur"               element={<PrivateRoute role="porteur"><DashboardPorteur /></PrivateRoute>} />
      <Route path="/porteur/nouveau"       element={<PrivateRoute role="porteur"><CreateProjectPage /></PrivateRoute>} />
      <Route path="/porteur/messages"      element={<PrivateRoute role="porteur"><MessagesPage /></PrivateRoute>} />
      <Route path="/porteur/projet"        element={<PrivateRoute role="porteur"><MonProjetPage /></PrivateRoute>} />
      <Route path="/porteur/investisseurs" element={<PrivateRoute role="porteur"><InvestisseursPage /></PrivateRoute>} />
      <Route path="/porteur/activite"      element={<PrivateRoute role="porteur"><ActivitePage /></PrivateRoute>} />
      <Route path="/porteur/documents"     element={<PrivateRoute role="porteur"><DocumentsPage /></PrivateRoute>} />
      <Route path="/porteur/finances"      element={<PrivateRoute role="porteur"><FinancesPage /></PrivateRoute>} />
      <Route path="/porteur/rapports"      element={<PrivateRoute role="porteur"><RapportsPagePorteur /></PrivateRoute>} />
      <Route path="/porteur/profil"        element={<PrivateRoute role="porteur"><ProfilPagePorteur /></PrivateRoute>} />
      <Route path="/porteur/parametres"    element={<PrivateRoute role="porteur"><ParametresPagePorteur /></PrivateRoute>} />

      <Route path="/investisseur"                element={<PrivateRoute role="investisseur"><DashboardInvestisseur /></PrivateRoute>} />
      <Route path="/investisseur/messages"       element={<PrivateRoute role="investisseur"><MessagesPage /></PrivateRoute>} />
      <Route path="/investisseur/projets"        element={<PrivateRoute role="investisseur"><ProjetsPage /></PrivateRoute>} />
      <Route path="/investisseur/portfolio"      element={<PrivateRoute role="investisseur"><PortfolioPage /></PrivateRoute>} />
      <Route path="/investisseur/favoris"        element={<PrivateRoute role="investisseur"><FavorisPage /></PrivateRoute>} />
      <Route path="/investisseur/rapports"       element={<PrivateRoute role="investisseur"><RapportsPageInv /></PrivateRoute>} />
      <Route path="/investisseur/profil"         element={<PrivateRoute role="investisseur"><ProfilPageInv /></PrivateRoute>} />
      <Route path="/investisseur/parametres"     element={<PrivateRoute role="investisseur"><ParametresPageInv /></PrivateRoute>} />

      <Route path="/share/:token" element={<SharePage />} />
        <Route path="/admin-panel" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </div>
  )
}

export default function App() {

  useEffect(() => {
    const saved = localStorage.getItem('golden_theme') ?? 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const [splash, setSplash] = useState(() => !sessionStorage.getItem('splash_done'))

  if (splash) return (
    <SplashScreen onDone={() => { sessionStorage.setItem('splash_done', '1'); setSplash(false) }} />
  )

  return (
    <AuthProvider>
              <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
    </AuthProvider>
  )
}
