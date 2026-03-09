const BASE = '/api/v1'

class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
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

  const res = await fetch(url.toString(), { method, headers, body: body != null ? JSON.stringify(body) : undefined })

  if (res.status === 401) {
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_refresh')
    localStorage.removeItem('ms_user')
    window.dispatchEvent(new Event('auth:logout'))
    throw new ApiError('Session expired', 401)
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

// Clients
export const getClients = (page = 0, size = 15) => get('/admin/clients', { page, size })

// Appointments
export const getAppointments   = (page = 0, size = 15, status) => get('/admin/appointments', { page, size, status })
export const cancelAppointment = (id)                           => del(`/admin/appointments/${id}`)

// Users
export const toggleUserActive = (id) => patch(`/admin/users/${id}/toggle-active`)

// Content
export const getContent    = (type)       => get('/admin/content', { type })
export const createContent = (data)       => post('/admin/content', data)
export const updateContent = (id, data)   => put(`/admin/content/${id}`, data)
export const deleteContent = (id)         => del(`/admin/content/${id}`)
export const toggleContent = (id)         => patch(`/admin/content/${id}/toggle`)

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
