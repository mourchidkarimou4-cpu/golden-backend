// src/lib/api.ts
import axios, { AxiosError } from 'axios'

const API_URL = import.meta.env["VITE_API_URL"] as string || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Injecter le JWT ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Rafraîchir le token si 401 ───────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Helper : extraire le message d'erreur ────────────────
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.error)  return data.error
    if (data?.detail) return typeof data.detail === 'string' ? data.detail : 'Erreur de validation.'
    if (data?.non_field_errors) return data.non_field_errors[0]
    // Premier champ en erreur
    if (typeof data === 'object') {
      const first = Object.values(data)[0]
      if (Array.isArray(first)) return String(first[0])
      return String(first)
    }
  }
  return 'Une erreur est survenue. Veuillez réessayer.'
}

// ════════════════════════════════════════════════════════
// ENDPOINTS
// ════════════════════════════════════════════════════════

export const authAPI = {
  register:  (data: RegisterData)   => api.post('/auth/register/', data),
  login:     (data: LoginData)      => api.post('/auth/login/', data),
  logout:    (refresh: string)      => api.post('/auth/logout/', { refresh }),
  refresh:   (refresh: string)      => api.post('/auth/token/refresh/', { refresh }),
  me:        ()                     => api.get('/users/me/'),
  updateMe:  (data: Partial<User>)  => api.put('/users/me/', data),
  kycSubmit: (formData: FormData)   => api.post('/auth/kyc/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  kycStatus: () => api.get('/auth/kyc/status/'),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/users/me/change-password/', data),
}

export const notificationsAPI = {
  list:       ()              => api.get('/core/notifications/'),
  markRead:   (id: string)    => api.post(`/core/notifications/${id}/read/`),
  markAllRead: ()             => api.post('/core/notifications/read-all/'),
}

export const projectsAPI = {
  list:      (params?: ProjectFilters) => api.get('/projects/', { params }),
  mine:      ()                        => api.get('/projects/mine/'),
  favorites: ()                        => api.get('/projects/favorites/'),
  detail:    (id: string)              => api.get(`/projects/${id}/`),
  create:    (data: ProjectData)       => api.post('/projects/', data),
  update:    (id: string, data: Partial<ProjectData>) => api.put(`/projects/${id}/`, data),
  patch:     (id: string, data: Partial<ProjectData>) => api.patch(`/projects/${id}/`, data),
  delete:    (id: string)              => api.delete(`/projects/${id}/`),
  submit:    (id: string)              => api.post(`/projects/${id}/submit/`),
  toggleFav:        (id: string)              => api.post(`/projects/${id}/favorite/`),
  createShareToken: (id: string)              => api.post(`/projects/${id}/share/`),
  getByShareToken:  (token: string)           => api.get(`/projects/share/${token}/`),
  addDoc:    (id: string, form: FormData) => api.post(`/projects/${id}/documents/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const matchingAPI = {
  recommendations: () => api.get('/matching/recommendations/'),
  dismiss: (projectId: string) => api.post(`/matching/dismiss/${projectId}/`),
}

export const messagingAPI = {
  threads:      ()                             => api.get('/messages/threads/'),
  createThread: (data: ThreadData)             => api.post('/messages/threads/', data),
  messages:     (threadId: string)             => api.get(`/messages/threads/${threadId}/`),
  send:         (threadId: string, body: string) => api.post(`/messages/threads/${threadId}/`, { body }),
}

export const investmentsAPI = {
  list:      ()                         => api.get('/investments/'),
  portfolio:  ()                                              => api.get('/investments/portfolio/'),
  rate:       (id: string, data: {score: number, comment?: string}) => api.post(`/investments/${id}/rate/`, data),
  myRatings:    ()                                              => api.get('/investments/my-ratings/'),
  getOffers:    (id: string)                                    => api.get(`/investments/${id}/offers/`),
  makeOffer:    (id: string, data: object)                      => api.post(`/investments/${id}/offer/`, data),
  history:    (id: string)                                    => api.get(`/investments/${id}/history/`),
  create:    (data: InvestmentData)     => api.post('/investments/', data),
  detail:    (id: string)               => api.get(`/investments/${id}/`),
  update:    (id: string, data: object) => api.patch(`/investments/${id}/`, data),
  byProject: (projectId: string)        => api.get(`/investments/project/${projectId}/`),
}

export const reportingAPI = {
  dashboardPorteur:  () => api.get('/reporting/dashboard/porteur/'),
  dashboardInvestor: () => api.get('/reporting/dashboard/investor/'),
  dashboardAdmin:    () => api.get('/reporting/dashboard/admin/'),
}

// ════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════

export interface User {
  id:              string
  email:           string
  full_name:       string
  first_name:      string
  last_name:       string
  role:            'porteur' | 'investisseur' | 'admin'
  is_kyc_verified: boolean
  kyc_status:      'not_submitted' | 'pending' | 'approved' | 'rejected'
  avatar?:         string
  country:         string
  city:            string
  phone_number:    string
  preferred_sectors:   string[]
  preferred_countries: string[]
  min_investment?: number
  max_investment?: number
  risk_profile:    'low' | 'medium' | 'high'
  created_at:      string
}

export interface RegisterData {
  email:        string
  password:     string
  password2:    string
  first_name:   string
  last_name:    string
  role:         'porteur' | 'investisseur'
  phone_number?: string
}

export interface LoginData {
  email:    string
  password: string
}

export interface ProjectFilters {
  sector?:      string
  status?:      string
  risk_level?:  string
  country?:     string
  amount_min?:  number
  amount_max?:  number
  roi_min?:     number
  search?:      string
  ordering?:    string
  page?:        number
}

export interface ProjectData {
  title:           string
  tagline:         string
  description:     string
  sector:          string
  country:         string
  city?:           string
  amount_needed:   number
  roi_estimated:   number
  duration_months: number
  min_investment?: number
  risk_level:      string
}

export interface ThreadData {
  project_id:    string
  recipient_id:  string
  first_message: string
  subject?:      string
}

export interface InvestmentData {
  project:          string
  amount:           number
  payment_method:   string
  roi_agreed?:      number
  duration_months?: number
  equity_percent?:  number
  notes?:           string
}

export interface PaginatedResponse<T> {
  pagination: {
    count:    number
    page:     number
    pages:    number
    next:     string | null
    previous: string | null
  }
  results: T[]
}
