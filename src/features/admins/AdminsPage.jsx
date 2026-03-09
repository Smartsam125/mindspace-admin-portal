import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Modal, Input, Select, Pagination, Avatar } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtDate } from '../../shared/utils/format'

const BLANK = { fullName: '', email: '', gender: 'PREFER_NOT_TO_SAY', phone: '' }

export default function AdminsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(BLANK)
  const { mutate, loading: saving } = useMutation()

  const { data: admins, loading, refetch } = useQuery(() => api.getAdmins())
  const list = Array.isArray(admins) ? admins : []

  const handleCreate = async (e) => {
    e.preventDefault()
    await mutate(() => api.createAdmin(form))
    toast.success('Admin created — temp password sent via email')
    setShowAdd(false)
    setForm(BLANK)
    refetch()
  }

  const handleRemove = async (admin) => {
    if (!window.confirm(`Deactivate admin "${admin.fullName}"?`)) return
    await mutate(() => api.removeAdmin(admin.id))
    toast.success('Admin deactivated')
    refetch()
  }

  const cols = ['Admin', 'Phone', 'Gender', 'Joined', 'Status', 'Actions']

  return (
    <div>
      <PageHeader
        title="Admin Management"
        subtitle="Manage platform administrators"
        action={<Btn onClick={() => { setForm(BLANK); setShowAdd(true) }}>+ Add Admin</Btn>}
      />

      <Card noPad>
        <DataTable
          columns={cols}
          rows={list}
          loading={loading}
          empty="No admins found"
          renderRow={a => (<>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={a.fullName} size={34} bg="#dbeafe" color="#1e40af" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: colors.dark }}>{a.fullName}</p>
                  <p className="text-xs" style={{ color: colors.muted }}>{a.email}</p>
                </div>
              </div>
            </Td>
            <Td muted>{a.phone || '—'}</Td>
            <Td><Badge status={a.gender} /></Td>
            <Td mono muted nowrap>{fmtDate(a.createdAt)}</Td>
            <Td nowrap><Badge status={a.active ? 'ACTIVE' : 'INACTIVE'} /></Td>
            <Td nowrap>
              {a.active && (
                <Btn variant="danger" size="sm" onClick={() => handleRemove(a)}>Deactivate</Btn>
              )}
            </Td>
          </>)}
        />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Admin">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Full Name *" value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
          <Input label="Email *" type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Gender *" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </Select>
            <Input label="Phone" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <p className="text-xs" style={{ color: colors.muted }}>A temporary password will be emailed to the new admin.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn type="submit" loading={saving}>Create Admin</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
