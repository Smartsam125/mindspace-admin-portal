const BASE = '/api/v1'

class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function tryRefresh() {
  const refresh = localStorage.getItem('ms_refresh')
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    const d = data.data
    localStorage.setItem('ms_token', d.accessToken)
    localStorage.setItem('ms_refresh', d.refreshToken)
    return true
  } catch {
    return false
  }
}

async function request(method, path, body, params) {
  const url = new URL(path, window.location.origin)
  url.pathname = BASE + path
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const token = localStorage.getItem('ms_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res = await fetch(url.toString(), { method, headers, body: body != null ? JSON.stringify(body) : undefined })

  // Try refresh on 401
  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const newToken = localStorage.getItem('ms_token')
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(url.toString(), { method, headers, body: body != null ? JSON.stringify(body) : undefined })
    }
    if (res.status === 401) {
      localStorage.removeItem('ms_token')
      localStorage.removeItem('ms_refresh')
      localStorage.removeItem('ms_user')
      window.dispatchEvent(new Event('auth:logout'))
      throw new ApiError('Session expired', 401)
    }
  }

  const data = await res.json()
  if (!res.ok) throw new ApiError(data.message || `HTTP ${res.status}`, res.status)
  return data
}

const get  = (p, params) => request('GET',    p, null,  params)
const post = (p, body)   => request('POST',   p, body)
const put  = (p, body)   => request('PUT',    p, body)
const patch= (p, body)   => request('PATCH',  p, body)
const del  = (p)         => request('DELETE', p)

// Auth
export const login     = (email, password) => post('/auth/login', { email, password, deviceName: 'Admin Portal', platform: 'WEB' })
export const verify2fa = (email, otp)      => post('/auth/verify-2fa', { email, otp, purpose: 'TWO_FACTOR_AUTH' })
export const logout    = (refreshToken)    => post('/auth/logout', { refreshToken })

// Dashboard
export const getDashboard = () => get('/admin/dashboard')

// Therapists
export const getTherapists   = (page = 0, size = 15)  => get('/admin/therapists', { page, size })
export const getTherapist    = (id)                     => get(`/admin/therapists/${id}`)
export const createTherapist = (data)                   => post('/admin/therapists', data)
export const editTherapist   = (id, data)               => put(`/admin/therapists/${id}`, data)

// Therapist sub-resources
export const getTherapistFeedbacks    = (id, page = 0, size = 15) => get(`/admin/therapists/${id}/feedbacks`, { page, size })
export const getTherapistAppointments = (id, page = 0, size = 15, status) => get(`/admin/therapists/${id}/appointments`, { page, size, status })

// Clients
export const getClients = (page = 0, size = 15) => get('/admin/clients', { page, size })

// Appointments (with advanced filters)
export const getAppointments = (page = 0, size = 15, filters = {}) => {
  const { status, therapistId, clientEmail, dateFrom, dateTo } = typeof filters === 'string' ? { status: filters } : (filters || {})
  return get('/admin/appointments', { page, size, status, therapistId, clientEmail, dateFrom, dateTo })
}
export const cancelAppointment = (id) => del(`/admin/appointments/${id}`)

// Users
export const toggleUserActive = (id) => patch(`/admin/users/${id}/toggle-active`)

// Payouts
export const getPayoutSummary   = (month) => get('/admin/payouts/summary', { month })
export const recordPayout       = (therapistId, data) => post(`/admin/therapists/${therapistId}/payouts`, data)
export const getTherapistPayouts = (id) => get(`/admin/therapists/${id}/payouts`)

// Content
export const getContent    = (type)       => get('/admin/content', { type })
export const createContent = (data)       => post('/admin/content', data)
export const updateContent = (id, data)   => put(`/admin/content/${id}`, data)
export const deleteContent = (id)         => del(`/admin/content/${id}`)
export const toggleContent = (id)         => patch(`/admin/content/${id}/toggle`)

// Events
export const getEventAttendees = (eventId) => get(`/admin/events/${eventId}/attendees`)

// Enum Options (public)
export const getOptions       = ()     => get('/public/options')
// Enum Options (admin CRUD)
export const addOption        = (data) => post('/admin/options', data)
export const deleteOption     = (id)   => del(`/admin/options/${id}`)
export const getAdminOptions  = ()     => get('/admin/options')

// Admin management (SUPER_ADMIN)
export const getAdmins    = ()     => get('/admin/admins')
export const createAdmin  = (data) => post('/admin/admins', data)
export const removeAdmin  = (id)   => del(`/admin/admins/${id}`)

// Broadcast
export const broadcast = (data) => post('/admin/broadcast', data)

// Upload
async function uploadFile(endpoint, file) {
  const token = localStorage.getItem('ms_token')
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new ApiError(data.message || 'Upload failed', res.status)
  return data.data.url
}

export const uploadProfilePicture = (file) => uploadFile('/admin/upload/profile-picture', file)
export const uploadContentImage   = (file) => uploadFile('/admin/upload/profile-picture', file)
