import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, Btn, Modal, Input, Select, Spinner, Empty, Badge } from '../../shared/components'
import { colors } from '../../shared/utils/colors'

const CATEGORIES = [
  { key: 'specializations', label: 'Specializations', cat: 'SPECIALIZATION' },
  { key: 'therapyTypes',    label: 'Therapy Types',    cat: 'THERAPY_TYPE' },
  { key: 'therapyStyles',   label: 'Therapy Styles',   cat: 'THERAPY_STYLE' },
  { key: 'moods',           label: 'Moods',             cat: 'MOOD' },
]

const BLANK = { category: 'SPECIALIZATION', name: '', label: '', description: '', sortOrder: 0 }

export default function OptionsPage() {
  const [activeTab, setActiveTab] = useState('specializations')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(BLANK)
  const { mutate, loading: saving } = useMutation()

  const { data, loading, refetch } = useQuery(() => api.getOptions())
  const options = data || {}

  const activeCat = CATEGORIES.find(c => c.key === activeTab)
  const list = options[activeTab] || []

  const handleAdd = async (e) => {
    e.preventDefault()
    await mutate(() => api.addOption({ ...form, category: activeCat.cat }))
    toast.success('Option added')
    setShowAdd(false)
    setForm(BLANK)
    refetch()
  }

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    await mutate(() => api.deleteOption(id))
    toast.success('Option deleted')
    refetch()
  }

  return (
    <div>
      <PageHeader
        title="Options"
        subtitle="Manage specializations, therapy types, styles, and moods"
        action={<Btn onClick={() => { setForm({ ...BLANK, category: activeCat.cat }); setShowAdd(true) }}>+ Add Option</Btn>}
      />

      <div className="flex gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setActiveTab(c.key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all"
            style={{
              background: activeTab === c.key ? colors.brand : '#fff',
              color: activeTab === c.key ? '#fff' : colors.muted,
              borderColor: activeTab === c.key ? colors.brand : '#e5e7eb',
            }}>
            {c.label} ({(options[c.key] || []).length})
          </button>
        ))}
      </div>

      {loading ? <Spinner center /> : !list.length ? <Empty message={`No ${activeCat.label.toLowerCase()} yet`} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100" style={{ color: colors.muted }}>ID: {item.id}</span>
                    <span className="text-xs font-mono" style={{ color: colors.muted }}>{item.name}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: colors.dark }}>{item.label}</p>
                  {item.description && <p className="text-xs mt-1" style={{ color: colors.muted }}>{item.description}</p>}
                </div>
                <button onClick={() => handleDelete(item.id, item.label)}
                  className="text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                  style={{ color: colors.danger, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add ${activeCat.label.slice(0, -1)}`}>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input label="Name (internal key) *" placeholder="e.g. ANXIETY_DISORDERS"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Label (shown to user) *" placeholder="e.g. I'm feeling anxious & overwhelmed"
            value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
          <Input label="Description" placeholder="Optional description"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input label="Sort Order" type="number"
            value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn type="submit" loading={saving}>Add</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
