// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { GoldenCursor } from '@/components/ui'

import LandingPage           from '@/pages/LandingPage'
import LoginPage             from '@/pages/LoginPage'
import RegisterPage          from '@/pages/RegisterPage'
import KYCPage               from '@/pages/KYCPage'
import DashboardPorteur      from '@/pages/DashboardPorteur'
import DashboardInvestisseur from '@/pages/DashboardInvestisseur'
import MessagesPage          from '@/pages/MessagesPage'
import CreateProjectPage     from '@/pages/CreateProjectPage'

function PrivateRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ background: '#0A0A0A', minHeight: '100vh' }} />
  if (!user)   return <Navigate to="/login" replace />
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
  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/kyc"      element={<PrivateRoute><KYCPage /></PrivateRoute>} />

      <Route path="/porteur"          element={<PrivateRoute role="porteur"><DashboardPorteur /></PrivateRoute>} />
      <Route path="/porteur/messages" element={<PrivateRoute role="porteur"><MessagesPage /></PrivateRoute>} />
      <Route path="/porteur/nouveau"  element={<PrivateRoute role="porteur"><CreateProjectPage /></PrivateRoute>} />

      <Route path="/investisseur"          element={<PrivateRoute role="investisseur"><DashboardInvestisseur /></PrivateRoute>} />
      <Route path="/investisseur/messages" element={<PrivateRoute role="investisseur"><MessagesPage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GoldenCursor />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
