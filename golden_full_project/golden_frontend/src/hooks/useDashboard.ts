// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { reportingAPI, investmentsAPI } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export function usePorteurDashboard() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    reportingAPI.dashboardPorteur()
      .then(({ data }) => setData(data))
      .catch(() => setError('Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useInvestorDashboard() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      reportingAPI.dashboardInvestor(),
      investmentsAPI.portfolio(),
    ]).then(([dash, port]) => {
      setData({ ...dash.data, portfolioDetails: port.data })
    }).catch(() => setError('Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ── usePortfolio ───────────────────────────────────────────
export function usePortfolio() {
  const [investments, setInvestments] = useState<any[]>([])
  const [summary,     setSummary]     = useState<any>(null)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      investmentsAPI.list(),
      investmentsAPI.portfolio(),
    ]).then(([list, summ]) => {
      setInvestments(list.data.results ?? list.data)
      setSummary(summ.data)
    }).finally(() => setLoading(false))
  }, [])

  return { investments, summary, loading }
}
