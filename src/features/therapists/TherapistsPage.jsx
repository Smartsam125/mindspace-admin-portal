import { useState } from 'react'
import toast from 'react-hot-toast'
import * as api from '../../shared/services/api'
import { useQuery, useMutation } from '../../shared/hooks'
import { PageHeader, Card, DataTable, Td, Badge, Btn, Modal, Input, Select, Textarea, Pagination, Avatar, Chip, Spinner } from '../../shared/components'
import { colors } from '../../shared/utils/colors'
import { fmtUGXFull, labelify } from '../../shared/utils/format'


function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    setUploading(true)
    try { onChange(await api.uploadProfilePicture(file)) }
    catch (ex) { setErr(ex.message) }
    finally { setUploading(false) }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: colors.muted }}>Profile Picture</label>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden border"
          style={{ borderColor: value ? colors.brand : '#e5e7eb', background: '#f9fafb' }}>
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-lg" style={{ color: '#d1d5db' }}>+</div>
          }
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold"
            style={{ borderColor: '#e5e7eb', color: colors.muted }}>
            {uploading ? 'Uploading...' : value ? 'Change' : 'Upload'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          {err && <p className="text-xs mt-1" style={{ color: colors.danger }}>{err}</p>}
        </div>
      </div>
    </div>
  )
}

function TherapistForm({ form, onChange, onSubmit, saving, label, options }) {
  const specs  = options?.specializations || []
  const types  = options?.therapyTypes || []
  const styles = options?.therapyStyles || []

  const toggleId = (key, id) => onChange(f => ({
    ...f, [key]: f[key].includes(id) ? f[key].filter(x => x !== id) : [...f[key], id]
  }))

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Full Name *" value={form.fullName} onChange={e => onChange(f => ({...f, fullName:e.target.value}))} required />
        <Input label="Email *" type="email" value={form.email} onChange={e => onChange(f => ({...f, email:e.target.value}))} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Gender *" value={form.gender} onChange={e => onChange(f => ({...f, gender:e.target.value}))}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </Select>
        <Select label="Title *" value={form.title} onChange={e => onChange(f => ({...f, title:e.target.value}))}>
          <option value="CLINICAL_PSYCHOLOGIST">Clinical Psychologist</option>
          <option value="COUNSELING_PSYCHOLOGIST">Counseling Psychologist</option>
          <option value="PSYCHIATRIST">Psychiatrist</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Phone" value={form.phone} onChange={e => onChange(f => ({...f, phone:e.target.value}))} />
        <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e => onChange(f => ({...f, dateOfBirth:e.target.value}))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="MoMo Phone" value={form.momoPhone} onChange={e => onChange(f => ({...f, momoPhone:e.target.value}))} />
        <Input label="MoMo Name" value={form.momoName} onChange={e => onChange(f => ({...f, momoName:e.target.value}))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Years Experience" type="number" value={form.yearsOfExperience} onChange={e => onChange(f => ({...f, yearsOfExperience:+e.target.value}))} />
        <Input label="Clients Served" type="number" value={form.clientsServedCount} onChange={e => onChange(f => ({...f, clientsServedCount:+e.target.value}))} />
      </div>
      <ImageUpload value={form.profilePictureUrl} onChange={url => onChange(f => ({ ...f, profilePictureUrl: url }))} />
      <Textarea label="Bio *" value={form.bio} onChange={e => onChange(f => ({...f, bio:e.target.value}))} required />

      <Select label="Therapy Type *" value={form.therapyTypeId} onChange={e => onChange(f => ({...f, therapyTypeId:+e.target.value}))}>
        <option value="">Select...</option>
        {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      </Select>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: colors.muted }}>Specializations *</p>
        <div className="flex flex-wrap gap-2">
          {specs.map(s => (
            <Chip key={s.id} label={s.label} active={form.specializationIds.includes(s.id)} onClick={() => toggleId('specializationIds', s.id)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: colors.muted }}>Therapy Styles</p>
        <div className="flex flex-wrap gap-2">
          {styles.map(s => (
            <Chip key={s.id} label={s.label} active={form.therapyStyleIds.includes(s.id)} onClick={() => toggleId('therapyStyleIds', s.id)} />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
        <Btn type="submit" loading={saving}>{label}</Btn>
      </div>
    </form>
  )
}

const BLANK = {
  fullName:'', email:'', gender:'FEMALE', title:'CLINICAL_PSYCHOLOGIST',
  phone:'', momoPhone:'', momoName:'', dateOfBirth:'', profilePictureUrl:'', bio:'',
  yearsOfExperience:0, clientsServedCount:0,
  specializationIds:[], therapyTypeId:'', therapyStyleIds:[],
}

export default function TherapistsPage({ onViewTherapist }) {
  const [page, setPage]             = useState(0)
  const [showAdd, setShowAdd]       = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(BLANK)
  const { mutate, loading: saving } = useMutation()

  const { data, loading, refetch }   = useQuery(() => api.getTherapists(page, 15), [page])
  const { data: options }            = useQuery(() => api.getOptions())
  const rows = data?.content || []

  const openEdit = (t) => {
    setForm({
      fullName:t.fullName||'', email:t.email||'', gender:t.gender||'FEMALE',
      title:t.title||'CLINICAL_PSYCHOLOGIST', phone:t.phone||'', momoPhone:t.momoPhone||'', momoName:t.momoName||'',
      dateOfBirth:'', profilePictureUrl:t.profilePictureUrl||'', bio:t.bio||'',
      yearsOfExperience:t.yearsOfExperience||0, clientsServedCount:t.clientsServedCount||0,
      specializationIds:t.specializationIds||[], therapyTypeId:t.therapyTypeId||'',
      therapyStyleIds:t.therapyStyleIds||[],
    })
    setEditTarget(t)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await mutate(() => api.createTherapist(form))
    toast.success('Therapist created')
    setShowAdd(false); setForm(BLANK); refetch()
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    await mutate(() => api.editTherapist(editTarget.id, form))
    toast.success('Therapist updated')
    setEditTarget(null); refetch()
  }

  const handleToggle = async (t) => {
    await mutate(() => api.toggleUserActive(t.id))
    toast.success(`User ${t.active ? 'deactivated' : 'activated'}`)
    refetch()
  }

  const cols = ['Therapist', 'Title', 'Specializations', 'Clients', 'Rating', 'Earnings', 'Status', 'Actions']

  return (
    <div>
      <PageHeader
        title="Therapists"
        subtitle={`${data?.totalElements ?? '—'} registered`}
        action={<Btn onClick={() => { setForm(BLANK); setShowAdd(true) }}>+ Add Therapist</Btn>}
      />

      <Card noPad>
        <DataTable
          columns={cols} rows={rows} loading={loading} empty="No therapists registered yet"
          renderRow={t => (<>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={t.fullName} src={t.profilePictureUrl} size={34} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: colors.dark }}>{t.fullName}</p>
                  <p className="text-xs" style={{ color: colors.muted }}>{t.email}</p>
                </div>
              </div>
            </Td>
            <Td muted><span className="text-xs">{labelify(t.title || '')}</span></Td>
            <Td>
              <div className="flex flex-wrap gap-1">
                {(t.specializations||[]).slice(0,2).map((s,i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: colors.brandLight, color: colors.brandDark }}>
                    {s.length > 20 ? s.substring(0, 18) + '…' : s}
                  </span>
                ))}
                {(t.specializations?.length||0) > 2 && (
                  <span className="text-xs" style={{ color: colors.muted }}>+{t.specializations.length - 2}</span>
                )}
              </div>
            </Td>
            <Td mono muted nowrap>{t.totalClientsHandled ?? t.clientsServedCount ?? '—'}</Td>
            <Td bold nowrap>★ {t.rating?.toFixed(1) ?? '—'}</Td>
            <Td mono nowrap>{t.totalEarnings ? fmtUGXFull(t.totalEarnings) : '—'}</Td>
            <Td nowrap><Badge status={t.online ? 'ONLINE' : 'OFFLINE'} /></Td>
            <Td nowrap>
              <div className="flex gap-2">
                <Btn variant="ghost" size="sm" onClick={() => onViewTherapist?.(t.id)}>View</Btn>
                <Btn variant="secondary" size="sm" onClick={() => openEdit(t)}>Edit</Btn>
                <Btn variant={t.active ? 'danger' : 'secondary'} size="sm" onClick={() => handleToggle(t)}>
                  {t.active ? 'Suspend' : 'Activate'}
                </Btn>
              </div>
            </Td>
          </>)}
        />
        <Pagination page={page} totalPages={data?.totalPages} total={data?.totalElements} onChange={setPage} />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Therapist" wide>
        <TherapistForm form={form} onChange={setForm} onSubmit={handleAdd} saving={saving} label="Create Therapist" options={options} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Therapist" wide>
        <TherapistForm form={form} onChange={setForm} onSubmit={handleEdit} saving={saving} label="Save Changes" options={options} />
      </Modal>
    </div>
  )
}
