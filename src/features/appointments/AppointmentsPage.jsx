import { useState } from 'react'
import toast from 'react-hot-toast'
import { Search, X } from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery, useMutation, useDebounce } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Pagination, Input } from '../../shared/components'
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
  const [page,        setPage]        = useState(0)
  const [status,      setStatus]      = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [dateFrom,    setDateFrom]    = useState('')
  const [dateTo,      setDateTo]      = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { mutate } = useMutation()

  const debouncedEmail = useDebounce(clientEmail, 400)

  const filters = { status: status || undefined, clientEmail: debouncedEmail || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }

  const { data, loading, refetch } = useQuery(
    () => api.getAppointments(page, 15, filters),
    [page, status, debouncedEmail, dateFrom, dateTo]
  )
  const rows = data?.content || []

  const handleFilter = (val) => { setStatus(val); setPage(0) }

  const handleCancel = async (a) => {
    if (!window.confirm(`Cancel appointment #${a.id}?`)) return
    await mutate(() => api.cancelAppointment(a.id))
    toast.success('Appointment cancelled')
    refetch()
  }

  const clearFilters = () => {
    setClientEmail('')
    setDateFrom('')
    setDateTo('')
  }

  const hasAdvancedFilters = clientEmail || dateFrom || dateTo

  const canCancel = (status) => !['COMPLETED','CANCELLED','REJECTED','MISSED_BY_CLIENT','MISSED_BY_THERAPIST'].includes(status)

  const cols = ['ID', 'Client', 'Therapist', 'Scheduled At', 'Type', 'Amount', 'Discount', 'Status', 'Actions']

  return (
    <div>
      <PageHeader title="Appointments" subtitle={`${data?.totalElements ?? '—'} total`}
        action={
          <Btn variant={showFilters ? 'primary' : 'secondary'} size="sm"
            onClick={() => setShowFilters(f => !f)}>
            <Search size={14} /> Filters
          </Btn>
        }
      />

      {/* Advanced filters */}
      {showFilters && (
        <Card className="mb-5">
          <div className="flex items-end gap-4 flex-wrap">
            <Input label="Client Email" value={clientEmail} placeholder="e.g. john@gmail.com"
              onChange={e => { setClientEmail(e.target.value); setPage(0) }}
              className="flex-1 min-w-[200px]" />
            <Input label="Date From" type="date" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(0) }}
              className="w-[170px]" />
            <Input label="Date To" type="date" value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(0) }}
              className="w-[170px]" />
            {hasAdvancedFilters && (
              <Btn variant="ghost" size="sm" onClick={clearFilters}>
                <X size={14} /> Clear
              </Btn>
            )}
          </div>
        </Card>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map(s => (
          <button key={s.value} onClick={() => handleFilter(s.value)}
            className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              background: status === s.value ? colors.brand : colors.white,
              color: status === s.value ? '#fff' : colors.muted,
              borderColor: status === s.value ? colors.brand : colors.pale,
              cursor: 'pointer',
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
