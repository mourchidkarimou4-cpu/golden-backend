// src/hooks/useProjects.ts
import { useState, useEffect, useCallback } from 'react'
import { projectsAPI, ProjectFilters } from '@/lib/api'

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await projectsAPI.list({ ...filters, page })
      setProjects(data.results ?? data)
      setTotal(data.pagination?.count ?? data.length)
    } catch {
      setError('Impossible de charger les projets.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters), page])

  useEffect(() => { fetch() }, [fetch])

  return { projects, loading, error, total, page, setPage, refetch: fetch }
}

// ── useMyProjects ──────────────────────────────────────────
export function useMyProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    projectsAPI.mine()
      .then(({ data }) => setProjects(data.results ?? data))
      .finally(() => setLoading(false))
  }, [])

  return { projects, loading }
}

// ── useFavorites ───────────────────────────────────────────
export function useFavorites() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    projectsAPI.favorites()
      .then(({ data }) => setFavorites(data.results ?? data))
      .finally(() => setLoading(false))
  }, [])

  return { favorites, loading }
}
