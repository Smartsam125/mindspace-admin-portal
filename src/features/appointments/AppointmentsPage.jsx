import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Pagination } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtDateTime, fmtUGXFull } from '../../shared/utils/format'

const STATUSES = [
  { value: '',                    label: 'All' },
  { value: 'PENDING_PAYMENT',     label: 'Pending Payment' },
  { value: 'PENDING_CONFIRMATION',label: 'Pending Confirm' },
  { value: 'CONFIRMED',           label: 'Confirmed' },
  { value: 'COMPLETED',           label: 'Completed' },
  { value: 'CANCELLED',           label: 'Cancelled' },
  { value: 'REJECTED',            label: 'Rejected' },
  { value: 'RESCHEDULED',         label: 'Rescheduled' },
  { value: 'MISSED_BY_CLIENT',    label: 'Missed (Client)' },
  { value: 'MISSED_BY_THERAPIST', label: 'Missed (Therapist)' },
]

export default function AppointmentsPage() {
  const [page,   setPage]   = useState(0)
  const [status, setStatus] = useState('')
  const { mutate } = useMutation()

  const { data, loading, refetch } = useQuery(
    () => api.getAppointments(page, 15, status || undefined),
    [page, status]
  )
  const rows = data?.content || []

  const handleFilter = (val) => { setStatus(val); setPage(0) }

  const handleCancel = async (a) => {
    if (!window.confirm(`Cancel appointment #${a.id}?`)) return
    await mutate(() => api.cancelAppointment(a.id))
    toast.success('Appointment cancelled')
    refetch()
  }

  const canCancel = (status) => !['COMPLETED','CANCELLED','REJECTED','MISSED_BY_CLIENT','MISSED_BY_THERAPIST'].includes(status)

  const cols = ['ID', 'Client', 'Therapist', 'Scheduled At', 'Type', 'Amount', 'Discount', 'Status', 'Actions']

  return (
    <div>
      <PageHeader title="Appointments" subtitle={`${data?.totalElements ?? '—'} total`} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map(s => (
          <button key={s.value} onClick={() => handleFilter(s.value)}
            className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: status === s.value ? colors.brand : colors.white,
              color: status === s.value ? '#fff' : colors.muted,
              borderColor: status === s.value ? colors.brand : colors.pale,
              
            }}>
            {s.label}
          </button>
        ))}
      </div>

      <Card noPad>
        <DataTable
          columns={cols}
          rows={rows}
          loading={loading}
          empty="No appointments found"
          renderRow={a => (<>
            <Td mono muted nowrap>#{a.id}</Td>
            <Td bold nowrap>{a.clientName}</Td>
            <Td nowrap>{a.therapistName}</Td>
            <Td mono muted nowrap>{fmtDateTime(a.scheduledAt)}</Td>
            <Td nowrap><Badge status={a.sessionType} /></Td>
            <Td mono bold nowrap>{fmtUGXFull(a.amountPaid)}</Td>
            <Td nowrap>
              {a.discountApplied
                ? <span className="text-xs font-bold" style={{ color: '#10b981' }}>Yes</span>
                : <span className="text-xs" style={{ color: colors.muted }}>No</span>
              }
            </Td>
            <Td nowrap><Badge status={a.status} /></Td>
            <Td nowrap>
              {canCancel(a.status) && (
                <Btn variant="danger" size="sm" onClick={() => handleCancel(a)}>Cancel</Btn>
              )}
            </Td>
          </>)}
        />
        <Pagination page={page} totalPages={data?.totalPages} total={data?.totalElements} onChange={setPage} />
      </Card>
    </div>
  )
}
