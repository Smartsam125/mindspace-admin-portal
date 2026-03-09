import { useState } from 'react'
import { LayoutDashboard, Users, UserCheck, Calendar, FileText, LogOut, ChevronLeft, ChevronRight, Settings, Shield, Bell } from 'lucide-react'
import { useAuth } from './features/auth/AuthContext'
import { Avatar } from './shared/components'
import { colors } from './shared/utils/colors'

import DashboardPage    from './features/dashboard/DashboardPage'
import TherapistsPage   from './features/therapists/TherapistsPage'
import ClientsPage      from './features/clients/ClientsPage'
import AppointmentsPage from './features/appointments/AppointmentsPage'
import ContentPage      from './features/content/ContentPage'
import OptionsPage      from './features/options/OptionsPage'
import AdminsPage       from './features/admins/AdminsPage'
import BroadcastPage    from './features/broadcast/BroadcastPage'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', Icon: Calendar },
  { id: 'therapists',   label: 'Therapists',   Icon: UserCheck },
  { id: 'clients',      label: 'Clients',      Icon: Users },
  { id: 'content',      label: 'Content',      Icon: FileText },
  { id: 'options',      label: 'Options',       Icon: Settings },
  { id: 'broadcast',    label: 'Broadcast',    Icon: Bell },
]

const SUPER_NAV = [
  { id: 'admins', label: 'Admins', Icon: Shield },
]

const PAGES = {
  dashboard:    DashboardPage,
  appointments: AppointmentsPage,
  therapists:   TherapistsPage,
  clients:      ClientsPage,
  content:      ContentPage,
  options:      OptionsPage,
  admins:       AdminsPage,
  broadcast:    BroadcastPage,
}

export default function AppShell() {
  const { user, logout }   = useAuth()
  const [active, setActive]       = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const navItems = isSuperAdmin ? [...NAV, ...SUPER_NAV] : NAV

  const Page = PAGES[active] || DashboardPage

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: colors.bg }}>

      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{ width: collapsed ? 60 : 230, background: colors.sidebar }}>

        <div className="flex items-center border-b px-3 py-4 gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: 56 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
            style={{ background: colors.brand }}>M</div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">MindSpace</p>
              <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin</p>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)}
            className="flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = active === id
            return (
              <button key={id} onClick={() => setActive(id)}
                className="flex items-center gap-3 rounded-lg transition-all w-full text-left border-0"
                style={{
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? colors.brand : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                }}>
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
            <Avatar name={user?.fullName || 'Admin'} size={28} bg={colors.brandDark} color="#fff" />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.role}</p>
                </div>
                <button onClick={logout} title="Logout"
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <LogOut size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-7 py-3 bg-white border-b flex-shrink-0"
          style={{ borderColor: '#f0f0f0' }}>
          <h2 className="font-bold text-base capitalize" style={{ color: colors.dark }}>
            {navItems.find(n => n.id === active)?.label}
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            <span className="text-xs font-medium" style={{ color: colors.muted }}>Connected</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-7">
          <Page />
        </main>
      </div>
    </div>
  )
}
