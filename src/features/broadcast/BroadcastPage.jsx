import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useMutation } from '../../shared/hooks'
import { PageHeader, Card, Btn, Input, Select, Textarea, Modal } from '../../shared/components'
import { colors } from '../../shared/utils/colors'

const ROLES = [
  { value: 'CLIENT',      label: 'All Clients' },
  { value: 'THERAPIST',   label: 'All Therapists' },
  { value: 'ADMIN',       label: 'All Admins' },
  { value: 'SUPER_ADMIN', label: 'All Super Admins' },
]

export default function BroadcastPage() {
  const [form, setForm] = useState({ title: '', body: '', targetRole: 'CLIENT' })
  const { mutate, loading, error } = useMutation()
  const [confirm, setConfirm] = useState(false)

  const handleSend = async () => {
    setConfirm(false)
    try {
      await mutate(() => api.broadcast(form))
      toast.success('Broadcast sent!')
      setForm({ title: '', body: '', targetRole: 'CLIENT' })
    } catch (e) {
      toast.error(e.message || 'Failed to send broadcast')
    }
  }

  const roleLabel = ROLES.find(r => r.value === form.targetRole)?.label || form.targetRole

  return (
    <div>
      <PageHeader title="Broadcast" subtitle="Send push notifications to all users" />

      <div className="max-w-xl">
        <Card>
          <form onSubmit={e => { e.preventDefault(); setConfirm(true) }} className="flex flex-col gap-4">
            <Select label="Target Audience *" value={form.targetRole}
              onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </Select>

            <Input label="Title *" placeholder="Notification title"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

            <Textarea label="Message *" placeholder="Notification body"
              value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required />

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm font-medium"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <div className="pt-2">
              <Btn type="submit" loading={loading}>Send Broadcast</Btn>
            </div>
          </form>
        </Card>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirm Broadcast">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: colors.dark }}>
            You are about to send a push notification to <strong>{roleLabel}</strong>.
          </p>
          <div className="rounded-lg p-4" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <p className="text-sm font-semibold" style={{ color: colors.dark }}>{form.title}</p>
            <p className="text-sm mt-1" style={{ color: colors.muted }}>{form.body}</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="secondary" onClick={() => setConfirm(false)}>Cancel</Btn>
            <Btn onClick={handleSend} loading={loading}>Send Now</Btn>
          </div>
        </div>
      </Modal>
    </div>
  )
}
