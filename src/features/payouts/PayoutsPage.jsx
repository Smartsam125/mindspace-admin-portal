import { useState } from 'react'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Modal, Textarea, StatCard, Spinner, Avatar } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtUGXFull, fmtUGX, fmtDateTime } from '../../shared/utils/format'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function shiftMonth(m, dir) {
  const [y, mo] = m.split('-').map(Number)
  const d = new Date(y, mo - 1 + dir, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function fmtMonth(m) {
  const [y, mo] = m.split('-').map(Number)
  return new Date(y, mo - 1).toLocaleDateString('en-UG', { month: 'long', year: 'numeric' })
}

export default function PayoutsPage({ onViewTherapist }) {
  const [month, setMonth] = useState(currentMonth())
  const [payTarget, setPayTarget] = useState(null)
  const [note, setNote] = useState('')
  const { mutate, loading: paying } = useMutation()

  const { data: summary, loading, refetch } = useQuery(
    () => api.getPayoutSummary(month), [month]
  )

  const therapists = summary?.therapists || []

  const handlePay = async (e) => {
    e.preventDefault()
    if (!payTarget) return
    await mutate(() => api.recordPayout(payTarget.therapistId, { month, note }))
    toast.success(`Payout recorded for ${payTarget.therapistName}`)
    setPayTarget(null)
    setNote('')
    refetch()
  }

  const cols = ['Therapist', 'MoMo Phone', 'MoMo Name', 'Monthly Earnings', 'Total Earnings', 'Status', 'Actions']

  return (
    <div>
      <PageHeader title="Therapist Payouts" subtitle="Monthly payout management" />

      {/* Month selector */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setMonth(m => shiftMonth(m, -1))}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb', background: '#fff', cursor: 'pointer' }}>
          <ChevronLeft size={16} style={{ color: colors.dark }} />
        </button>
        <h3 className="font-bold text-lg min-w-[180px] text-center" style={{ color: colors.dark }}>
          {fmtMonth(month)}
        </h3>
        <button onClick={() => setMonth(m => shiftMonth(m, 1))}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb', background: '#fff', cursor: 'pointer' }}>
          <ChevronRight size={16} style={{ color: colors.dark }} />
        </button>
      </div>

      {/* Summary cards */}
      {loading ? <Spinner center /> : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Owed" value={fmtUGX(summary?.totalOwed)} accent={colors.warning} />
            <StatCard label="Paid Out" value={fmtUGX(summary?.totalPaidOut)} accent={colors.success} />
            <StatCard label="Pending" value={fmtUGX(summary?.totalPending)} accent={colors.danger} />
          </div>

          <Card noPad>
            <DataTable
              columns={cols}
              rows={therapists}
              loading={false}
              empty="No therapist payouts for this month"
              renderRow={t => (<>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={t.therapistName} size={34} />
                    <div>
                      <button className="font-semibold text-sm hover:underline text-left"
                        style={{ color: colors.brand, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => onViewTherapist?.(t.therapistId)}>
                        {t.therapistName}
                      </button>
                      <p className="text-xs" style={{ color: colors.muted }}>{t.therapistEmail}</p>
                    </div>
                  </div>
                </Td>
                <Td mono muted>{t.momoPhone || '—'}</Td>
                <Td muted>{t.momoName || '—'}</Td>
                <Td mono bold nowrap>{fmtUGXFull(t.monthlyEarnings)}</Td>
                <Td mono muted nowrap>{fmtUGXFull(t.totalEarnings)}</Td>
                <Td nowrap>
                  {t.paidThisMonth
                    ? <Badge status="COMPLETED" />
                    : <Badge status="PENDING_PAYMENT" />
                  }
                </Td>
                <Td nowrap>
                  {!t.paidThisMonth && t.monthlyEarnings > 0 && (
                    <Btn size="sm" onClick={() => { setPayTarget(t); setNote(`Paid via MTN MoMo ${fmtMonth(month)}`) }}>
                      Record Payout
                    </Btn>
                  )}
                  {t.paidThisMonth && t.lastPayout && (
                    <span className="text-xs" style={{ color: colors.muted }}>
                      Paid {fmtDateTime(t.lastPayout)}
                    </span>
                  )}
                </Td>
              </>)}
            />
          </Card>
        </>
      )}

      {/* Record Payout Modal */}
      <Modal open={!!payTarget} onClose={() => setPayTarget(null)} title="Record Payout">
        {payTarget && (
          <form onSubmit={handlePay} className="flex flex-col gap-4">
            <div className="rounded-xl p-4" style={{ background: colors.brandLight }}>
              <p className="text-sm font-bold" style={{ color: colors.dark }}>{payTarget.therapistName}</p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                MoMo: {payTarget.momoPhone} ({payTarget.momoName})
              </p>
              <p className="text-lg font-extrabold mt-2" style={{ color: colors.brandDark }}>
                {fmtUGXFull(payTarget.monthlyEarnings)}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                Month: {fmtMonth(month)}
              </p>
            </div>

            <div className="rounded-lg p-3 border" style={{ borderColor: colors.warning + '40', background: '#fffbeb' }}>
              <p className="text-xs font-semibold" style={{ color: '#92400e' }}>
                Make sure you have sent the MoMo payment before recording. This action cannot be undone.
              </p>
            </div>

            <Textarea label="Note" value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Paid via MTN MoMo March 2026" />

            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="secondary" type="button" onClick={() => setPayTarget(null)}>Cancel</Btn>
              <Btn type="submit" loading={paying}>Confirm Payout</Btn>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
