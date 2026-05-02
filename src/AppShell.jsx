import { useState } from 'react'
import {
  LayoutDashboard, Users, UserCheck, Calendar, FileText,
  LogOut, ChevronLeft, ChevronRight, Settings, Shield, Bell, Wallet
} from 'lucide-react'
import logoSplash from '/assets/logo_splash.png'
import { useAuth } from './features/auth/AuthContext'
import { Avatar } from './shared/components'
import { colors } from './shared/utils/colors'

import DashboardPage       from './features/dashboard/DashboardPage'
import TherapistsPage      from './features/therapists/TherapistsPage'
import TherapistDetailPage from './features/therapists/TherapistDetailPage'
import ClientsPage         from './features/clients/ClientsPage'
import AppointmentsPage    from './features/appointments/AppointmentsPage'
import PayoutsPage         from './features/payouts/PayoutsPage'
import ContentPage         from './features/content/ContentPage'
import OptionsPage         from './features/options/OptionsPage'
import AdminsPage          from './features/admins/AdminsPage'
import BroadcastPage       from './features/broadcast/BroadcastPage'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', Icon: Calendar },
  { id: 'therapists',   label: 'Therapists',   Icon: UserCheck },
  { id: 'clients',      label: 'Clients',      Icon: Users },
  { id: 'payouts',      label: 'Payouts',      Icon: Wallet },
  { id: 'content',      label: 'Content',      Icon: FileText },
  { id: 'options',      label: 'Options',      Icon: Settings },
  { id: 'broadcast',    label: 'Broadcast',    Icon: Bell },
]

const SUPER_NAV = [
  { id: 'admins', label: 'Admins', Icon: Shield },
]

export default function AppShell() {
  const { user, logout }   = useAuth()
  const [active, setActive]       = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [therapistDetailId, setTherapistDetailId] = useState(null)

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const navItems = isSuperAdmin ? [...NAV, ...SUPER_NAV] : NAV

  const viewTherapist = (id) => {
    setTherapistDetailId(id)
    setActive('therapist-detail')
  }

  const backFromDetail = () => {
    setTherapistDetailId(null)
    setActive('therapists')
  }

  const navigate = (id) => {
    setActive(id)
    setTherapistDetailId(null)
  }

  const renderPage = () => {
    if (active === 'therapist-detail' && therapistDetailId) {
      return <TherapistDetailPage therapistId={therapistDetailId} onBack={backFromDetail} />
    }
    switch (active) {
      case 'dashboard':    return <DashboardPage />
      case 'appointments': return <AppointmentsPage />
      case 'therapists':   return <TherapistsPage onViewTherapist={viewTherapist} />
      case 'clients':      return <ClientsPage />
      case 'payouts':      return <PayoutsPage onViewTherapist={viewTherapist} />
      case 'content':      return <ContentPage />
      case 'options':      return <OptionsPage />
      case 'admins':       return <AdminsPage />
      case 'broadcast':    return <BroadcastPage />
      default:             return <DashboardPage />
    }
  }

  const activeLabel = active === 'therapist-detail'
    ? 'Therapist Detail'
    : navItems.find(n => n.id === active)?.label || 'Dashboard'

  const sideW = collapsed ? 68 : 240

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: colors.bg }}>

      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: sideW,
          background: `linear-gradient(180deg, ${colors.sidebar} 0%, #1D1720 100%)`,
        }}
      >
        <div
          className="flex items-center px-4 py-5 gap-3"
          style={{ minHeight: 64 }}
        >
          <img
            src={logoSplash}
            alt="MindSpace"
            className="flex-shrink-0 rounded-xl"
            style={{ width: 36, height: 36, objectFit: 'contain' }}
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-sm truncate"
                style={{ color: '#fff', fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
              >
                MindSpace
              </p>
              <p
                className="text-[10px] tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}
              >
                Admin
              </p>
            </div>
          )}
        </div>

        <div className="px-3 mb-2">
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.id || (item.id === 'therapists' && active === 'therapist-detail')
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex items-center gap-3 rounded-xl transition-all duration-200 w-full text-left border-0"
                style={{
                  padding: collapsed ? '10px 0' : '10px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? 'rgba(76,204,221,0.12)' : 'transparent',
                  color: isActive ? colors.brand : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                  }
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{ width: 3, height: 20, background: colors.brand }}
                  />
                )}
                <item.Icon size={17} style={{ flexShrink: 0 }} strokeWidth={isActive ? 2 : 1.6} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="px-3 mt-2 mb-2">
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div className="px-3 pb-4">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 rounded-xl transition-all duration-200 w-full border-0 mb-3"
            style={{
              padding: collapsed ? '8px 0' : '8px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'rgba(255,255,255,0.3)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <div
            className={`flex items-center rounded-xl transition-all duration-200 ${collapsed ? 'justify-center py-2' : 'gap-3 p-3'}`}
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Avatar name={user?.fullName || 'Admin'} size={30} bg="rgba(76,204,221,0.2)" color={colors.brand} />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-lg transition-colors duration-150"
                  style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#DC2626'
                    e.currentTarget.style.background = 'rgba(220,38,38,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <h2
            className="text-base capitalize"
            style={{
              color: colors.dark,
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 500,
            }}
          >
            {activeLabel}
          </h2>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}60` }}
            />
            <span className="text-xs font-medium" style={{ color: colors.muted }}>Connected</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
