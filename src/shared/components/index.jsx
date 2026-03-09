import { colors, statusColors } from '../utils/colors'
import { labelify } from '../utils/format'

export function Badge({ status }) {
  const s = statusColors[status] || { bg: '#f3f4f6', text: '#374151' }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}>
      {labelify(status)}
    </span>
  )
}

export function Card({ children, className = '', noPad }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 ${noPad ? '' : 'p-6'} ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, Icon, accent = colors.brand }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 truncate" style={{ color: colors.muted }}>{label}</p>
          <p className="text-2xl font-extrabold leading-none truncate" style={{ color: colors.dark }}>{value ?? '—'}</p>
          {sub && <p className="text-xs mt-1.5 truncate" style={{ color: colors.muted }}>{sub}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
            style={{ background: accent + '18' }}>
            <Icon size={18} style={{ color: accent }} />
          </div>
        )}
      </div>
    </Card>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: colors.dark }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: colors.muted }}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}

const btnVariants = {
  primary:   `text-white border-transparent`,
  secondary: `bg-white border-gray-200`,
  danger:    `bg-red-50 border-red-200 text-red-700`,
  ghost:     `bg-transparent border-transparent`,
}
const btnSizes = {
  xs: 'px-3 py-1 text-xs rounded-lg',
  sm: 'px-3.5 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-2xl',
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '', loading }) {
  const isPrimary = variant === 'primary'
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold border cursor-pointer transition-all ${btnVariants[variant]} ${btnSizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
      style={isPrimary ? { background: colors.brand } : { color: colors.dark }}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold" style={{ color: colors.muted }}>{label}</label>}
      <input
        className="rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors w-full"
        style={{ border: `1.5px solid ${error ? colors.danger : '#e5e7eb'}`, background: '#fff', color: colors.dark }}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: colors.danger }}>{error}</span>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold" style={{ color: colors.muted }}>{label}</label>}
      <select className="rounded-lg px-3.5 py-2.5 text-sm outline-none w-full"
        style={{ border: '1.5px solid #e5e7eb', background: '#fff', color: colors.dark }}
        {...props}>
        {children}
      </select>
      {error && <span className="text-xs" style={{ color: colors.danger }}>{error}</span>}
    </div>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold" style={{ color: colors.muted }}>{label}</label>}
      <textarea className="rounded-lg px-3.5 py-2.5 text-sm outline-none resize-none w-full"
        style={{ border: '1.5px solid #e5e7eb', background: '#fff', color: colors.dark }}
        rows={4} {...props} />
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[92vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#f3f4f6' }}>
          <h2 className="font-bold text-lg" style={{ color: colors.dark }}>{title}</h2>
          <button onClick={onClose} className="text-xl leading-none p-1 hover:opacity-70"
            style={{ color: colors.muted, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export function DataTable({ columns, rows, loading, empty = 'No records found', renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {columns.map(col => (
              <th key={col} className="px-4 py-3 text-left whitespace-nowrap font-semibold uppercase tracking-wider"
                style={{ fontSize: 11, color: colors.muted, borderBottom: '1px solid #f3f4f6' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length}><Spinner center /></td></tr>
          ) : !rows?.length ? (
            <tr><td colSpan={columns.length}>
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <p className="text-sm" style={{ color: colors.muted }}>{empty}</p>
              </div>
            </td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b last:border-0 hover:bg-gray-50/60 transition-colors"
              style={{ borderColor: '#f3f4f6' }}>
              {renderRow(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Td({ children, bold, mono, muted, nowrap }) {
  return (
    <td className={`px-4 py-3 text-sm ${nowrap ? 'whitespace-nowrap' : ''}`}
      style={{ color: muted ? colors.muted : colors.dark, fontWeight: bold ? 600 : 400, fontSize: mono ? 12 : 13,
        fontVariantNumeric: mono ? 'tabular-nums' : undefined }}>
      {children}
    </td>
  )
}

export function Pagination({ page, totalPages, total, onChange }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#f3f4f6' }}>
      <p className="text-xs" style={{ color: colors.muted }}>
        Page {page + 1} / {totalPages}{total != null ? ` · ${total} total` : ''}
      </p>
      <div className="flex gap-2">
        <Btn variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>← Prev</Btn>
        <Btn variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Next →</Btn>
      </div>
    </div>
  )
}

export function Spinner({ center }) {
  const el = <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.brand, borderTopColor: 'transparent' }} />
  if (!center) return el
  return <div className="flex items-center justify-center py-16">{el}</div>
}

export function Chip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
      style={{ background: active ? colors.brand : '#fff', color: active ? '#fff' : colors.muted, borderColor: active ? colors.brand : '#e5e7eb' }}>
      {typeof label === 'string' ? labelify(label) : label}
    </button>
  )
}

export function Avatar({ name = '', src, size = 36, bg = colors.brandLight, color = colors.brandDark }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (src) return <img src={src} alt={name} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, background: bg, color, fontSize: size * 0.35 }}>
      {initials || '?'}
    </div>
  )
}

export function Empty({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2">
      <p className="text-sm" style={{ color: colors.muted }}>{message || 'Nothing here yet'}</p>
    </div>
  )
}
