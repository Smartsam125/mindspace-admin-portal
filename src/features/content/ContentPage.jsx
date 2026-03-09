import { useState } from 'react'
import toast from 'react-hot-toast'
import { ExternalLink } from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, Badge, Btn, Modal, Input, Select, Textarea, Spinner, Empty } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtDate } from '../../shared/utils/format'

const CONTENT_TYPES = ['AFFIRMATION', 'EVENT', 'RESOURCE']

const BLANK = { type: 'AFFIRMATION', title: '', body: '', imageUrl: '', externalLink: '', category: '', eventDate: '' }

export default function ContentPage() {
  const [activeType, setActiveType] = useState('AFFIRMATION')
  const [showAdd,    setShowAdd]    = useState(false)
  const [form,       setForm]       = useState(BLANK)
  const { mutate, loading: saving } = useMutation()

  const { data: items, loading, refetch } = useQuery(() => api.getContent(activeType), [activeType])
  const list = Array.isArray(items) ? items : []

  const handleCreate = async (e) => {
    e.preventDefault()
    await mutate(() => api.createContent(form))
    toast.success('Content created')
    setShowAdd(false)
    setForm(BLANK)
    refetch()
  }

  const handleToggle = async (id, current) => {
    await mutate(() => api.toggleContent(id))
    toast.success(current ? 'Content deactivated' : 'Content activated')
    refetch()
  }

  const typeColors = {
    AFFIRMATION: { bg: '#e0f7fa', text: '#00838f', border: '#4CCCDD' },
    EVENT:       { bg: '#f3e8ff', text: '#7c3aed', border: '#a78bfa' },
    RESOURCE:    { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  }

  return (
    <div>
      <PageHeader
        title="Content"
        subtitle="Manage affirmations, events and resources shown in the app"
        action={
          <Btn onClick={() => { setForm({ ...BLANK, type: activeType }); setShowAdd(true) }}>
            + New {activeType.charAt(0) + activeType.slice(1).toLowerCase()}
          </Btn>
        }
      />

      {/* Type selector */}
      <div className="flex gap-3 mb-6">
        {CONTENT_TYPES.map(t => {
          const tc = typeColors[t]
          return (
            <button key={t} onClick={() => setActiveType(t)}
              className="px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{
                background: activeType === t ? tc.bg : colors.white,
                color: activeType === t ? tc.text : colors.muted,
                borderColor: activeType === t ? tc.border : colors.pale,
                
              }}>
              {t.charAt(0) + t.slice(1).toLowerCase()}s
            </button>
          )
        })}
      </div>

      {/* Content grid */}
      {loading ? <Spinner center /> : !list.length ? <Empty message={`No ${activeType.toLowerCase()}s yet`} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between mb-3">
                <Badge status={item.type} />
                <button
                  onClick={() => handleToggle(item.id, item.active)}
                  className="text-xs font-bold px-2.5 py-1 rounded-full border transition-all"
                  style={{
                    background: item.active ? '#d1fae5' : '#fee2e2',
                    color: item.active ? '#065f46' : '#991b1b',
                    borderColor: item.active ? '#6ee7b7' : '#fca5a5',
                    
                  }}>
                  {item.active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="w-full h-36 object-cover rounded-xl mb-3" />
              )}

              <h3 className="font-extrabold text-sm mb-2 leading-snug" style={{ color: colors.dark,  }}>
                {item.title}
              </h3>

              {item.body && (
                <p className="text-xs leading-relaxed mb-3" style={{ color: colors.muted,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.body}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
                <div className="flex flex-wrap gap-2">
                  {item.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: colors.bg, color: colors.muted }}>
                      {item.category}
                    </span>
                  )}
                  {item.eventDate && (
                    <span className="text-xs font-bold" style={{ color: colors.brand }}>
                      📅 {fmtDate(item.eventDate)}
                    </span>
                  )}
                </div>
                {item.externalLink && (
                  <a href={item.externalLink} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold" style={{ color: colors.brand }}>
                    <ExternalLink size={12} /> Link
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Content">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Select label="Type *" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>

          <Input label="Title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

          <Textarea label="Body" value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />

          <Input label="Image URL" value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />

          <Input label="External Link" value={form.externalLink}
            onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))} />

          <Input label="Category" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />

          {form.type === 'EVENT' && (
            <Input label="Event Date" type="date" value={form.eventDate}
              onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn type="submit" loading={saving}>Create</Btn>
          </div>
        </form>
      </Modal>
    </div>
  )
}
