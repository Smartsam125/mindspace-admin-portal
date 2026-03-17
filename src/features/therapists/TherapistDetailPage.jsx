import { useState } from 'react'
import { ArrowLeft, Star, Users, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery } from '../../shared/hooks'
import { Card, StatCard, Badge, Btn, DataTable, Td, Pagination, Spinner, Avatar } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtUGXFull, fmtUGX, fmtDateTime, fmtDate, labelify } from '../../shared/utils/format'

const TABS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'appointments',  label: 'Appointments' },
  { id: 'feedbacks',     label: 'Feedbacks' },
  { id: 'payouts',       label: 'Payout History' },
]

const APT_STATUSES = [
  { value: '',                    label: 'All' },
  { value: 'COMPLETED',          label: 'Completed' },
  { value: 'CONFIRMED',          label: 'Confirmed' },
  { value: 'PENDING_CONFIRMATION',label: 'Pending' },
  { value: 'CANCELLED',          label: 'Cancelled' },
  { value: 'MISSED_BY_CLIENT',   label: 'Missed' },
]

export default function TherapistDetailPage({ therapistId, onBack }) {
  const [tab, setTab] = useState('overview')

  const { data: stats, loading } = useQuery(
    () => api.getTherapist(therapistId), [therapistId]
  )

  if (loading) return <Spinner center />
  if (!stats) return <p className="text-sm text-center py-10" style={{ color: colors.muted }}>Therapist not found</p>

  const p = stats.profile || {}

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb', background: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={16} style={{ color: colors.dark }} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={p.fullName} src={p.profilePictureUrl} size={44} />
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold truncate" style={{ color: colors.dark }}>{p.fullName}</h1>
            <p className="text-sm" style={{ color: colors.muted }}>
              {labelify(p.title || '')} &middot; {p.email}
            </p>
          </div>
        </div>
        <Badge status={p.online ? 'ONLINE' : 'OFFLINE'} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: '#f3f4f6' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-semibold transition-all border-b-2"
            style={{
              borderColor: tab === t.id ? colors.brand : 'transparent',
              color: tab === t.id ? colors.brand : colors.muted,
              background: 'none', cursor: 'pointer',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab stats={stats} profile={p} />}
      {tab === 'appointments' && <AppointmentsTab therapistId={therapistId} />}
      {tab === 'feedbacks' && <FeedbacksTab therapistId={therapistId} />}
      {tab === 'payouts' && <PayoutsTab therapistId={therapistId} />}
    </div>
  )
}

function OverviewTab({ stats, profile }) {
  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Appointments" value={stats.totalAppointments} Icon={Calendar} accent={colors.brand} />
        <StatCard label="Completed" value={stats.completedAppointments} Icon={CheckCircle} accent="#10b981" />
        <StatCard label="Unique Clients" value={stats.uniqueClientsServed} Icon={Users} accent="#8b5cf6" />
        <StatCard label="Average Rating" value={stats.averageRating?.toFixed(1) ?? '—'}
          sub={`${stats.totalRatings ?? 0} ratings`} Icon={Star} accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Appointment breakdown */}
        <Card>
          <h3 className="font-bold text-sm mb-4" style={{ color: colors.dark }}>Appointment Breakdown</h3>
          {[
            { label: 'Completed',  value: stats.completedAppointments,  color: '#10b981' },
            { label: 'Confirmed',  value: stats.confirmedAppointments,  color: '#3b82f6' },
            { label: 'Pending',    value: stats.pendingAppointments,    color: '#f59e0b' },
            { label: 'Cancelled',  value: stats.cancelledAppointments,  color: '#6b7280' },
            { label: 'Missed',     value: stats.missedAppointments,     color: '#ef4444' },
          ].map(item => {
            const total = stats.totalAppointments || 1
            const pct = ((item.value || 0) / total * 100).toFixed(0)
            return (
              <div key={item.label} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#f9f9f9' }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-sm flex-1" style={{ color: colors.dark }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value ?? 0}</span>
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: colors.muted }}>{pct}%</span>
              </div>
            )
          })}
        </Card>

        {/* Earnings & profile info */}
        <Card>
          <h3 className="font-bold text-sm mb-4" style={{ color: colors.dark }}>Earnings & Info</h3>
          <div className="space-y-3">
            <InfoRow label="Total Earnings" value={fmtUGXFull(stats.totalEarnings)} bold />
            <InfoRow label="Monthly Earnings" value={fmtUGXFull(stats.monthlyEarnings)} />
            <InfoRow label="Phone" value={profile.phone || '—'} />
            <InfoRow label="MoMo Phone" value={profile.momoPhone || '—'} />
            <InfoRow label="MoMo Name" value={profile.momoName || '—'} />
            <InfoRow label="Experience" value={profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : '—'} />
            <InfoRow label="Therapy Type" value={profile.therapyType || '—'} />
          </div>
          {profile.specializations?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: colors.muted }}>Specializations</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.specializations.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: colors.brandLight, color: colors.brandDark }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: '#f9f9f9' }}>
      <span className="text-xs" style={{ color: colors.muted }}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : ''}`} style={{ color: colors.dark }}>{value}</span>
    </div>
  )
}

function AppointmentsTab({ therapistId }) {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('')

  const { data, loading } = useQuery(
    () => api.getTherapistAppointments(therapistId, page, 15, status || undefined),
    [therapistId, page, status]
  )
  const rows = data?.content || (Array.isArray(data) ? data : [])

  const cols = ['ID', 'Client', 'Scheduled At', 'Type', 'Amount', 'Status']

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {APT_STATUSES.map(s => (
          <button key={s.value} onClick={() => { setStatus(s.value); setPage(0) }}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: status === s.value ? colors.brand : '#fff',
              color: status === s.value ? '#fff' : colors.muted,
              borderColor: status === s.value ? colors.brand : '#e5e7eb',
              cursor: 'pointer',
            }}>
            {s.label}
          </button>
        ))}
      </div>

      <Card noPad>
        <DataTable columns={cols} rows={rows} loading={loading} empty="No appointments found"
          renderRow={a => (<>
            <Td mono muted nowrap>#{a.id}</Td>
            <Td bold nowrap>{a.clientName}</Td>
            <Td mono muted nowrap>{fmtDateTime(a.scheduledAt)}</Td>
            <Td nowrap><Badge status={a.sessionType} /></Td>
            <Td mono bold nowrap>{fmtUGXFull(a.amountPaid)}</Td>
            <Td nowrap><Badge status={a.status} /></Td>
          </>)}
        />
        {data?.totalPages > 1 && (
          <Pagination page={page} totalPages={data.totalPages} total={data.totalElements} onChange={setPage} />
        )}
      </Card>
    </div>
  )
}

function FeedbacksTab({ therapistId }) {
  const [page, setPage] = useState(0)

  const { data, loading } = useQuery(
    () => api.getTherapistFeedbacks(therapistId, page, 15),
    [therapistId, page]
  )
  const rows = data?.content || (Array.isArray(data) ? data : [])

  const cols = ['Client', 'Session Date', 'Rating', 'Comments', 'Submitted']

  return (
    <Card noPad>
      <DataTable columns={cols} rows={rows} loading={loading} empty="No feedbacks yet"
        renderRow={f => (<>
          <Td bold nowrap>{f.clientName}</Td>
          <Td mono muted nowrap>{fmtDateTime(f.sessionDate)}</Td>
          <Td nowrap>
            <div className="flex items-center gap-1">
              {f.skipped ? (
                <span className="text-xs" style={{ color: colors.muted }}>Skipped</span>
              ) : (
                <>
                  <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  <span className="font-bold text-sm">{f.rating}</span>
                </>
              )}
            </div>
          </Td>
          <Td>
            <p className="text-sm max-w-xs truncate" style={{ color: colors.dark }}>
              {f.comments || '—'}
            </p>
          </Td>
          <Td mono muted nowrap>{fmtDateTime(f.submittedAt)}</Td>
        </>)}
      />
      {data?.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.totalElements} onChange={setPage} />
      )}
    </Card>
  )
}

function PayoutsTab({ therapistId }) {
  const { data, loading } = useQuery(
    () => api.getTherapistPayouts(therapistId), [therapistId]
  )
  const rows = Array.isArray(data) ? data : []

  const cols = ['Month', 'Amount', 'MoMo Phone', 'MoMo Name', 'Note', 'Paid By', 'Paid At']

  return (
    <Card noPad>
      <DataTable columns={cols} rows={rows} loading={loading} empty="No payouts recorded"
        renderRow={p => (<>
          <Td bold nowrap>{p.month}</Td>
          <Td mono bold nowrap>{fmtUGXFull(p.amount)}</Td>
          <Td mono muted>{p.momoPhone || '—'}</Td>
          <Td muted>{p.momoName || '—'}</Td>
          <Td><p className="text-sm max-w-xs truncate">{p.note || '—'}</p></Td>
          <Td muted>{p.paidByAdmin || '—'}</Td>
          <Td mono muted nowrap>{fmtDateTime(p.paidAt)}</Td>
        </>)}
      />
    </Card>
  )
}
