import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../../shared/services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null)
  const [ready,     setReady]     = useState(false)
  const [needs2FA,  setNeeds2FA]  = useState(false)
  const [twoFAEmail,setTwoFAEmail]= useState('')

  useEffect(() => {
    const token  = localStorage.getItem('ms_token')
    const stored = localStorage.getItem('ms_user')
    if (token && stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setReady(true)
    const onLogout = () => { setUser(null); setNeeds2FA(false) }
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    const d = res.data
    if (d.twoFactorRequired) {
      setNeeds2FA(true)
      setTwoFAEmail(email)
      return
    }
    _saveSession(d)
  }

  const verify2fa = async (otp) => {
    const res = await api.verify2fa(twoFAEmail, otp)
    _saveSession(res.data)
    setNeeds2FA(false)
  }

  const logout = async () => {
    const refresh = localStorage.getItem('ms_refresh')
    try { if (refresh) await api.logout(refresh) } catch {}
    localStorage.removeItem('ms_token')
    localStorage.removeItem('ms_refresh')
    localStorage.removeItem('ms_user')
    setUser(null)
  }

  const _saveSession = (d) => {
    localStorage.setItem('ms_token',   d.accessToken)
    localStorage.setItem('ms_refresh', d.refreshToken)
    const u = { id: d.userId, email: d.email, fullName: d.fullName, role: d.role }
    localStorage.setItem('ms_user', JSON.stringify(u))
    setUser(u)
  }

  return (
    <Ctx.Provider value={{ user, ready, needs2FA, twoFAEmail, login, verify2fa, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
