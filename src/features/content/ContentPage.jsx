import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  ExternalLink, Pencil, Trash2, Search, MapPin, User, Users, ImagePlus, X,
  BookOpen, Sparkles, CalendarDays, Quote, Clock, Globe, Plus, Filter,
} from 'lucide-react'
import * as api from '../../shared/services/api'
import { useQuery, useMutation, useDebounce } from '../../shared/hooks'
import { PageHeader, Btn, Modal, Input, Select, Textarea, Spinner, Empty, Chip, Avatar } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtDate, labelify } from '../../shared/utils/format'

function ContentImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    setUploading(true)
    try { onChange(await api.uploadContentImage(file)) }
    catch (ex) { setErr(ex.message) }
    finally { setUploading(false) }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: colors.muted }}>Image</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: colors.brand }}>
          <img src={value} alt="" className="w-full h-40 object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
            style={{ border: '1px solid #e5e7eb' }}>
            <X size={14} style={{ color: colors.danger }} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed cursor-pointer hover:border-solid transition-all"
          style={{ borderColor: uploading ? colors.brand : '#e5e7eb', background: '#f9fafb' }}>
          {uploading
            ? <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.brand, borderTopColor: 'transparent' }} />
            : <ImagePlus size={22} style={{ color: colors.muted }} />
          }
          <span className="text-xs font-semibold" style={{ color: colors.muted }}>
            {uploading ? 'Uploading...' : 'Click to upload image'}
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
      {err && <p className="text-xs" style={{ color: colors.danger }}>{err}</p>}
    </div>
  )
}

const CONTENT_TYPES = ['AFFIRMATION', 'EVENT', 'RESOURCE']

const MOOD_CATEGORIES = ['HAPPY', 'OKAY', 'ANXIOUS', 'SAD', 'OVERWHELMED']

const BLANK = { type: 'AFFIRMATION', title: '', body: '', imageUrl: '', externalLink: '', category: '', eventDate: '', author: '', location: '', resourceType: '' }

const TYPE_META = {
  AFFIRMATION: {
    Icon: Sparkles,
    gradient: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e0f2f1 100%)',
    accent: '#00838f',
    accentLight: '#e0f7fa',
    border: '#80deea',
    label: 'Affirmations',
  },
  EVENT: {
    Icon: CalendarDays,
    gradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #fce7f3 100%)',
    accent: '#7c3aed',
    accentLight: '#f3e8ff',
    border: '#c4b5fd',
    label: 'Events',
  },
  RESOURCE: {
    Icon: BookOpen,
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fef3c7 100%)',
    accent: '#854d0e',
    accentLight: '#fef9c3',
    border: '#fde047',
    label: 'Resources',
  },
}

const MOOD_EMOJI = {
  HAPPY: '😊',
  OKAY: '😐',
  ANXIOUS: '😰',
  SAD: '😢',
  OVERWHELMED: '😩',
  GENERAL: '🌿',
}

const MOOD_COLORS = {
  HAPPY:       { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  OKAY:        { bg: '#e0f2fe', text: '#075985', border: '#7dd3fc' },
  ANXIOUS:     { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  SAD:         { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  OVERWHELMED: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  GENERAL:     { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
}

function isPastEvent(dateStr) {
  if (!dateStr) return false
  const eventDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate < today
}

function daysUntilEvent(dateStr) {
  if (!dateStr) return null
  const eventDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)
  return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
}

function AffirmationCard({ item, onEdit, onDelete, onToggle, index }) {
  const moodKey = item.category || 'GENERAL'
  const moodColor = MOOD_COLORS[moodKey] || MOOD_COLORS.GENERAL

  return (
    <div className="group relative rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: '#fff',
        borderColor: moodColor.border + '80',
        animationDelay: `${index * 60}ms`,
        animation: 'contentFadeIn 0.4s ease-out both',
      }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: moodColor.border }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img">{MOOD_EMOJI[moodKey]}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: moodColor.bg, color: moodColor.text }}>
              {labelify(moodKey)}
            </span>
          </div>
          <CardActions item={item} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
        </div>

        <div className="relative pl-4 mb-3" style={{ borderLeft: `3px solid ${moodColor.border}` }}>
          <Quote size={14} className="absolute -left-0.5 -top-0.5 opacity-20" style={{ color: moodColor.text }} />
          <h3 className="font-bold text-sm leading-snug" style={{ color: colors.dark, fontFamily: 'Fraunces, serif' }}>
            {item.title}
          </h3>
        </div>

        {item.body && (
          <p className="text-xs leading-relaxed italic" style={{
            color: colors.muted,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            &ldquo;{item.body}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <span className="text-xs" style={{ color: colors.muted }}>{fmtDate(item.createdAt)}</span>
          <ActivePill active={item.active} />
        </div>
      </div>
    </div>
  )
}

function EventCard({ item, onEdit, onDelete, onToggle, onViewAttendees, index }) {
  const past = isPastEvent(item.eventDate)
  const days = daysUntilEvent(item.eventDate)
  const meta = TYPE_META.EVENT

  return (
    <div className="group relative rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: past ? '#fafafa' : '#fff',
        borderColor: past ? '#e5e7eb' : meta.border + '80',
        opacity: past ? 0.65 : 1,
        animationDelay: `${index * 60}ms`,
        animation: 'contentFadeIn 0.4s ease-out both',
      }}>
      {item.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" style={{ filter: past ? 'grayscale(0.6)' : 'none' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
          {item.eventDate && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.9)', color: past ? colors.muted : meta.accent }}>
                <CalendarDays size={12} className="inline mr-1.5 -mt-0.5" />
                {fmtDate(item.eventDate)}
              </div>
              {days !== null && !past && days <= 7 && (
                <div className="px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                  style={{ background: days === 0 ? '#ef4444' : '#f59e0b', color: '#fff' }}>
                  {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d away`}
                </div>
              )}
              {past && (
                <div className="px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                  Past
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {!item.imageUrl && item.eventDate && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
              style={{ background: past ? '#f3f4f6' : meta.accentLight, border: `1.5px solid ${past ? '#e5e7eb' : meta.border}` }}>
              <span className="text-xs font-black leading-none" style={{ color: past ? colors.muted : meta.accent }}>
                {new Date(item.eventDate).getDate()}
              </span>
              <span className="text-[9px] font-bold uppercase leading-none mt-0.5" style={{ color: past ? colors.muted : meta.accent }}>
                {new Date(item.eventDate).toLocaleString('en', { month: 'short' })}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {days !== null && !past && days <= 7 && (
                <span className="text-xs font-bold" style={{ color: days === 0 ? '#ef4444' : '#f59e0b' }}>
                  {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                </span>
              )}
              {past && <span className="text-xs font-bold" style={{ color: colors.muted }}>Past event</span>}
            </div>
            <div className="ml-auto">
              <CardActions item={item} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            </div>
          </div>
        )}

        {item.imageUrl && (
          <div className="flex items-start justify-between mb-3">
            <div />
            <CardActions item={item} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
          </div>
        )}

        <h3 className="font-extrabold text-sm mb-2 leading-snug" style={{ color: past ? colors.muted : colors.dark }}>
          {item.title}
        </h3>

        {item.body && (
          <p className="text-xs leading-relaxed mb-3" style={{
            color: colors.muted,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.body}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-2 mt-auto pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          {item.location && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#f3f4f6', color: colors.muted }}>
              <MapPin size={10} /> {item.location}
            </span>
          )}
          {item.attendeeCount != null && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewAttendees(item) }}
              className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Users size={10} />
              {item.attendeeCount} {item.attendeeCount === 1 ? 'attendee' : 'attendees'}
            </button>
          )}
          <ActivePill active={item.active} />
        </div>
      </div>
    </div>
  )
}

function ResourceCard({ item, onEdit, onDelete, onToggle, index }) {
  const meta = TYPE_META.RESOURCE

  return (
    <div className="group relative rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: '#fff',
        borderColor: '#f3f4f6',
        animationDelay: `${index * 60}ms`,
        animation: 'contentFadeIn 0.4s ease-out both',
      }}>
      {item.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          {item.category ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: meta.accentLight, color: meta.accent }}>
              {labelify(item.category)}
            </span>
          ) : <div />}
          <CardActions item={item} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
        </div>

        <h3 className="font-extrabold text-sm mb-2 leading-snug" style={{ color: colors.dark }}>
          {item.title}
        </h3>

        {item.author && (
          <p className="flex items-center gap-1.5 text-xs mb-2" style={{ color: colors.muted }}>
            <User size={11} /> <span className="font-medium">{item.author}</span>
          </p>
        )}

        {item.body && (
          <p className="text-xs leading-relaxed mb-3" style={{
            color: colors.muted,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.body}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <span className="text-xs" style={{ color: colors.muted }}>{fmtDate(item.createdAt)}</span>
          <div className="flex items-center gap-2">
            {item.externalLink && (
              <a href={item.externalLink} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold" style={{ color: meta.accent }}>
                <ExternalLink size={11} /> View
              </a>
            )}
            <ActivePill active={item.active} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CardActions({ item, onEdit, onDelete, onToggle }) {
  return (
    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onEdit(item)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
        <Pencil size={13} style={{ color: colors.muted }} />
      </button>
      <button onClick={() => onDelete(item)}
        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
        <Trash2 size={13} style={{ color: colors.danger }} />
      </button>
      <button onClick={() => onToggle(item.id, item.active)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title={item.active ? 'Deactivate' : 'Activate'}>
        <div className="w-2 h-2 rounded-full" style={{ background: item.active ? colors.success : '#d1d5db' }} />
      </button>
    </div>
  )
}

function ActivePill({ active }) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        background: active ? '#d1fae5' : '#fee2e2',
        color: active ? '#065f46' : '#991b1b',
      }}>
      {active ? 'Live' : 'Draft'}
    </span>
  )
}

function MoodSummaryBar({ categoryCounts }) {
  const entries = Object.entries(categoryCounts)
  if (!entries.length) return null
  const total = entries.reduce((sum, [, c]) => sum + c, 0)

  return (
    <div className="rounded-2xl border overflow-hidden mb-5" style={{ background: '#fff', borderColor: '#f3f4f6' }}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.muted }}>Mood Distribution</span>
        <span className="text-xs font-bold" style={{ color: colors.dark }}>{total} total</span>
      </div>
      <div className="flex h-2 mx-5 mb-3 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
        {entries.map(([mood, count]) => {
          const mc = MOOD_COLORS[mood] || MOOD_COLORS.GENERAL
          return (
            <div key={mood} style={{ width: `${(count / total) * 100}%`, background: mc.border }}
              className="transition-all" title={`${labelify(mood)}: ${count}`} />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 pb-4">
        {entries.map(([mood, count]) => {
          const mc = MOOD_COLORS[mood] || MOOD_COLORS.GENERAL
          return (
            <span key={mood} className="flex items-center gap-1.5 text-xs" style={{ color: mc.text }}>
              <span role="img">{MOOD_EMOJI[mood]}</span>
              <span className="font-semibold">{labelify(mood)}</span>
              <span className="font-bold">{count}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

const cardStyle = document.createElement('style')
cardStyle.textContent = `
@keyframes contentFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`
if (!document.getElementById('content-page-animations')) {
  cardStyle.id = 'content-page-animations'
  document.head.appendChild(cardStyle)
}

export default function ContentPage() {
  const [activeType,     setActiveType]     = useState('AFFIRMATION')
  const [showForm,       setShowForm]       = useState(false)
  const [editTarget,     setEditTarget]     = useState(null)
  const [form,           setForm]           = useState(BLANK)
  const [search,         setSearch]         = useState('')
  const [catFilter,      setCatFilter]      = useState('')
  const [attendeesEvent, setAttendeesEvent] = useState(null)
  const { mutate, loading: saving } = useMutation()

  const { data: items, loading, refetch } = useQuery(() => api.getContent(activeType), [activeType])
  const { data: optionsData } = useQuery(() => api.getOptions())
  const { data: attendees, loading: loadingAttendees } = useQuery(
    () => attendeesEvent ? api.getEventAttendees(attendeesEvent.id) : null,
    [attendeesEvent?.id]
  )
  const list = Array.isArray(items) ? items : []

  const resourceCategories = useMemo(() => {
    if (!optionsData) return []
    const cats = optionsData.resourceCategories || optionsData.RESOURCE_CATEGORY || []
    return Array.isArray(cats) ? cats : []
  }, [optionsData])

  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    let result = list
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.body?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q)
      )
    }
    if (catFilter) {
      result = result.filter(item => (item.category || 'GENERAL') === catFilter)
    }
    if (activeType === 'EVENT') {
      result = [...result].sort((a, b) => {
        const aP = isPastEvent(a.eventDate)
        const bP = isPastEvent(b.eventDate)
        if (aP !== bP) return aP ? 1 : -1
        return new Date(a.eventDate || 0) - new Date(b.eventDate || 0)
      })
    }
    return result
  }, [list, debouncedSearch, catFilter, activeType])

  const categoryCounts = useMemo(() => {
    if (activeType !== 'AFFIRMATION') return {}
    const counts = {}
    list.forEach(item => {
      const key = item.category || 'GENERAL'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [list, activeType])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ ...BLANK, type: activeType })
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditTarget(item)
    setForm({
      type: item.type || activeType,
      title: item.title || '',
      body: item.body || '',
      imageUrl: item.imageUrl || '',
      externalLink: item.externalLink || '',
      category: item.category || '',
      eventDate: item.eventDate || '',
      author: item.author || '',
      location: item.location || '',
      resourceType: item.resourceType || '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditTarget(null)
    setForm(BLANK)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editTarget) {
      await mutate(() => api.updateContent(editTarget.id, form))
      toast.success('Content updated')
    } else {
      await mutate(() => api.createContent(form))
      toast.success('Content created')
    }
    closeForm()
    refetch()
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    await mutate(() => api.deleteContent(item.id))
    toast.success('Content deleted')
    refetch()
  }

  const handleToggle = async (id, current) => {
    await mutate(() => api.toggleContent(id))
    toast.success(current ? 'Content deactivated' : 'Content activated')
    refetch()
  }

  const changeType = (type) => {
    setActiveType(type)
    setSearch('')
    setCatFilter('')
  }

  const availableCategories = activeType === 'AFFIRMATION'
    ? [...MOOD_CATEGORIES, 'GENERAL']
    : activeType === 'RESOURCE'
      ? resourceCategories.map(c => c.name || c.label)
      : []

  const meta = TYPE_META[activeType]

  const renderCard = (item, index) => {
    const props = { item, onEdit: openEdit, onDelete: handleDelete, onToggle: handleToggle, index }
    switch (activeType) {
      case 'AFFIRMATION': return <AffirmationCard key={item.id} {...props} />
      case 'EVENT':       return <EventCard key={item.id} {...props} onViewAttendees={setAttendeesEvent} />
      case 'RESOURCE':    return <ResourceCard key={item.id} {...props} />
      default:            return null
    }
  }

  return (
    <div>
      <PageHeader
        title="Content"
        subtitle="Manage affirmations, events and resources shown in the app"
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} className="-ml-0.5" /> New {activeType.charAt(0) + activeType.slice(1).toLowerCase()}
          </Btn>
        }
      />

      {/* Type tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: '#f3f4f6' }}>
        {CONTENT_TYPES.map(t => {
          const tm = TYPE_META[t]
          const active = activeType === t
          return (
            <button key={t} onClick={() => changeType(t)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 justify-center"
              style={{
                background: active ? '#fff' : 'transparent',
                color: active ? tm.accent : colors.muted,
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              <tm.Icon size={15} />
              {tm.label}
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md ml-0.5"
                style={{ background: active ? tm.accentLight : 'transparent', color: active ? tm.accent : colors.muted }}>
                {active ? list.length : ''}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search & category filter */}
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: colors.muted }} />
          <input
            className="rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-none w-full transition-colors"
            style={{ border: '1.5px solid #e5e7eb', background: '#fff', color: colors.dark }}
            placeholder={`Search ${activeType.toLowerCase()}s...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {availableCategories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} style={{ color: colors.muted }} />
            <Chip label="All" active={!catFilter} onClick={() => setCatFilter('')} />
            {availableCategories.map(cat => (
              <Chip key={cat}
                label={activeType === 'AFFIRMATION' ? `${MOOD_EMOJI[cat] || ''} ${labelify(cat)}` : cat}
                active={catFilter === cat}
                onClick={() => setCatFilter(catFilter === cat ? '' : cat)} />
            ))}
          </div>
        )}
      </div>

      {/* Affirmation mood summary bar */}
      {activeType === 'AFFIRMATION' && <MoodSummaryBar categoryCounts={categoryCounts} />}

      {/* Content grid */}
      {loading ? <Spinner center /> : !filtered.length ? (
        <Empty message={debouncedSearch || catFilter ? 'No matching content found' : `No ${activeType.toLowerCase()}s yet — create your first one!`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => renderCard(item, i))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal open={showForm} onClose={closeForm} title={editTarget ? 'Edit Content' : 'Create Content'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!editTarget && (
            <Select label="Type *" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, category: '', author: '', location: '', eventDate: '' }))}>
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          )}

          <Input label="Title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

          <Textarea label="Body" value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />

          <ContentImageUpload value={form.imageUrl}
            onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />

          {form.type === 'RESOURCE' && (
            <>
              <Input label="Author" value={form.author} placeholder="e.g. Bessel van der Kolk"
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              <Select label="Category" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">— Select category —</option>
                {resourceCategories.map(c => (
                  <option key={c.name || c.id} value={c.name}>{c.label || labelify(c.name)}</option>
                ))}
              </Select>
              <Select label="Resource Type" value={form.resourceType || ''}
                onChange={e => setForm(f => ({ ...f, resourceType: e.target.value }))}>
                <option value="">— Select type —</option>
                <option value="ARTICLE">Article</option>
                <option value="DOCUMENT">Document</option>
                <option value="VIDEO">Video</option>
                <option value="CONTACT">Contact</option>
                <option value="EXTERNAL_LINK">External Link</option>
              </Select>
              <Input label="External Link" value={form.externalLink} placeholder="https://..."
                onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))} />
            </>
          )}

          {form.type === 'AFFIRMATION' && (
            <Select label="Mood Category" value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">General (shown to all moods)</option>
              {MOOD_CATEGORIES.map(m => (
                <option key={m} value={m}>{MOOD_EMOJI[m]} {m.charAt(0) + m.slice(1).toLowerCase()}</option>
              ))}
            </Select>
          )}

          {form.type === 'EVENT' && (
            <>
              <Input label="Event Date" type="date" value={form.eventDate}
                onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
              <Input label="Location" value={form.location} placeholder='e.g. Online / Zoom'
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="secondary" type="button" onClick={closeForm}>Cancel</Btn>
            <Btn type="submit" loading={saving}>{editTarget ? 'Save Changes' : 'Create'}</Btn>
          </div>
        </form>
      </Modal>

      {/* Attendees modal */}
      <Modal open={!!attendeesEvent} onClose={() => setAttendeesEvent(null)}
        title={`Attendees — ${attendeesEvent?.title || ''}`}>
        {loadingAttendees ? <Spinner center /> :
          !attendees?.length ? <Empty message="No one has RSVP'd to this event yet" /> : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {attendees.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#f9fafb' }}>
                  <Avatar src={user.profilePictureUrl} name={user.fullName} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: colors.dark }}>{user.fullName}</p>
                    <p className="text-xs truncate" style={{ color: colors.muted }}>{user.email}</p>
                  </div>
                  {user.phone && (
                    <span className="text-xs" style={{ color: colors.muted }}>{user.phone}</span>
                  )}
                </div>
              ))}
            </div>
          )
        }
        <div className="flex justify-end pt-4">
          <Btn variant="secondary" onClick={() => setAttendeesEvent(null)}>Close</Btn>
        </div>
      </Modal>
    </div>
  )
}
