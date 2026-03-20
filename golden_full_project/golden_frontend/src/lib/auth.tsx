// src/lib/auth.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, User, getErrorMessage } from './api'

interface AuthContextType {
  user:       User | null
  loading:    boolean
  login:      (email: string, password: string) => Promise<void>
  logout:     () => Promise<void>
  refreshUser: () => Promise<void>
  isPorteur:  boolean
  isInvestor: boolean
  isAdmin:    boolean
  isKycVerified: boolean
  needsKyc:   boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.me()
      setUser(data)
    } catch {
      // token invalide
      localStorage.clear()
      setUser(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password })
    // Le backend retourne soit {access, refresh} soit {tokens: {access, refresh}}
    const access  = data.tokens?.access  ?? data.access
    const refresh = data.tokens?.refresh ?? data.refresh
    localStorage.setItem('access_token',  access)
    localStorage.setItem('refresh_token', refresh)
    await refreshUser()
  }

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) await authAPI.logout(refresh).catch(() => {})
    localStorage.clear()
    setUser(null)
  }

  const isPorteur  = user?.role === 'porteur'
  const isInvestor = user?.role === 'investisseur'
  const isAdmin    = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout, refreshUser,
      isPorteur, isInvestor, isAdmin,
      isKycVerified: user?.is_kyc_verified ?? false,
      needsKyc: !!user && !user.is_kyc_verified,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
