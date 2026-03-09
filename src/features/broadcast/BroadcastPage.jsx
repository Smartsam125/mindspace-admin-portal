import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useMutation } from '../../shared/hooks'
import { PageHeader, Card, Btn, Input, Select, Textarea } from '../../shared/components'
import { colors } from '../../shared/utils/colors'

export default function BroadcastPage() {
  const [form, setForm] = useState({ title: '', body: '', targetRole: 'CLIENT' })
  const { mutate, loading } = useMutation()

  const handleSend = async (e) => {
    e.preventDefault()
    if (!window.confirm(`Send push notification to all ${form.targetRole}s?`)) return
    await mutate(() => api.broadcast(form))
    toast.success('Broadcast sent!')
    setForm({ title: '', body: '', targetRole: 'CLIENT' })
  }

  return (
    <div>
      <PageHeader title="Broadcast" subtitle="Send push notifications to all users" />

      <div className="max-w-xl">
        <Card>
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <Select label="Target Audience *" value={form.targetRole}
              onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}>
              <option value="CLIENT">All Clients</option>
              <option value="THERAPIST">All Therapists</option>
            </Select>

            <Input label="Title *" placeholder="Notification title"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

            <Textarea label="Message *" placeholder="Notification body"
              value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required />

            <div className="pt-2">
              <Btn type="submit" loading={loading}>Send Broadcast</Btn>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
