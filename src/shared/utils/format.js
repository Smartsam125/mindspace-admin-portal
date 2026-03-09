export const fmtUGX = (v) => {
  if (v == null) return '—'
  if (v >= 1_000_000) return `UGX ${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `UGX ${(v / 1_000).toFixed(0)}K`
  return `UGX ${v.toLocaleString()}`
}

export const fmtUGXFull = (v) =>
  v != null ? `UGX ${Number(v).toLocaleString()}` : '—'

export const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const fmtDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-UG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')

export const labelify = (s = '') => s.replace(/_/g, ' ')
