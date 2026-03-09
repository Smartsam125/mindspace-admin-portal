import { Users, UserCheck, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery } from '../../shared/hooks'
import { StatCard, Card, Badge, Spinner, PageHeader, Avatar } from '../../shared/components'
import { fmtUGX, fmtDateTime } from '../../shared/utils/format'
import { colors } from '../../shared/utils/colors'

export default function DashboardPage() {
  const { data: dash, loading: dashLoading } = useQuery(() => api.getDashboard())
  const { data: aptsData, loading: aptsLoading } = useQuery(() => api.getAppointments(0, 6))

  const s = dash || {}
  const recentApts = aptsData?.content || []

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Platform overview" />

      {/* Stat cards */}
      {dashLoading ? <Spinner center /> : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
          <StatCard label="Total Clients"      value={s.totalClients?.toLocaleString()}       sub="Registered users"             Icon={Users}      accent={colors.brand} />
          <StatCard label="Total Therapists"   value={s.totalTherapists}                      sub={`${s.activeTherapists ?? '—'} active`}        Icon={UserCheck}  accent="#10b981" />
          <StatCard label="Total Appointments" value={s.totalAppointments?.toLocaleString()}  sub={`${s.upcomingAppointments ?? '—'} upcoming`}  Icon={Calendar}   accent="#f59e0b" />
          <StatCard label="Completed Sessions" value={s.completedAppointments?.toLocaleString()} sub="All time"                  Icon={TrendingUp}  accent="#8b5cf6" />
          <StatCard label="Upcoming"           value={s.upcomingAppointments?.toLocaleString()} sub="Scheduled ahead"            Icon={Clock}       accent={colors.brandDark} />
          <StatCard label="Total Revenue"      value={fmtUGX(s.totalRevenue)}                sub="All time"                     Icon={DollarSign}  accent="#059669" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Recent appointments */}
        <Card className="xl:col-span-3" noPad>
          <div className="px-6 pt-5 pb-3 border-b" style={{ borderColor: '#f3f4f6' }}>
            <h3 className="font-extrabold text-base" style={{ color: colors.dark,  }}>
              Recent Appointments
            </h3>
          </div>
          {aptsLoading ? <Spinner center /> : (
            <div>
              {!recentApts.length && (
                <p className="text-sm text-center py-10" style={{ color: colors.muted }}>No appointments yet</p>
              )}
              {recentApts.map(a => (
                <div key={a.id} className="flex items-center justify-between px-6 py-3.5 border-b last:border-0 hover:bg-gray-50/60 transition-colors"
                  style={{ borderColor: '#f9f9f9' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={a.clientName} size={34} />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: colors.dark }}>{a.clientName}</p>
                      <p className="text-xs truncate" style={{ color: colors.muted }}>
                        {a.therapistName} · {fmtDateTime(a.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <Badge status={a.sessionType} />
                    <Badge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Revenue breakdown */}
        <Card className="xl:col-span-2">
          <h3 className="font-extrabold text-base mb-5" style={{ color: colors.dark,  }}>
            Session Breakdown
          </h3>
          {dashLoading ? <Spinner center /> : (
            <>
              {[
                { label: 'Total',     value: s.totalAppointments,     color: colors.brand },
                { label: 'Upcoming',  value: s.upcomingAppointments,  color: '#f59e0b' },
                { label: 'Completed', value: s.completedAppointments, color: '#10b981' },
                { label: 'Therapists',value: s.totalTherapists,       color: '#8b5cf6' },
                { label: 'Active',    value: s.activeTherapists,      color: colors.brandDark },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: '#f9f9f9' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-sm" style={{ color: colors.dark }}>{item.label}</span>
                  </div>
                  <span className="font-extrabold text-lg" style={{ color: item.color,  }}>
                    {item.value?.toLocaleString() ?? '—'}
                  </span>
                </div>
              ))}

              <div className="mt-5 rounded-2xl p-4" style={{ background: colors.brandLight }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.brandDark,  }}>
                  Total Revenue
                </p>
                <p className="text-xl font-extrabold" style={{ color: colors.dark,  }}>
                  {s.totalRevenue != null ? `UGX ${s.totalRevenue.toLocaleString()}` : '—'}
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
