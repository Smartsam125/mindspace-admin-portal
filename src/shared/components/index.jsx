import { colors, statusColors } from '../utils/colors'
import { labelify } from '../utils/format'

export function Badge({ status }) {
  const s = statusColors[status] || { bg: '#F5F5F4', text: '#44403C' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.text, letterSpacing: '0.01em' }}
    >
      {labelify(status)}
    </span>
  )
}

export function Card({ children, className = '', noPad }) {
  return (
    <div
      className={`rounded-2xl ${noPad ? '' : 'p-6'} ${className}`}
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 1px 2px rgba(28,25,23,0.04), 0 4px 12px rgba(28,25,23,0.02)',
      }}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, Icon, accent = colors.brand }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wider mb-2.5 truncate"
            style={{ color: colors.muted, letterSpacing: '0.06em' }}
          >
            {label}
          </p>
          <p
            className="text-2xl leading-none truncate"
            style={{ color: colors.dark, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
          >
            {value ?? '—'}
          </p>
          {sub && (
            <p className="text-xs mt-2 truncate" style={{ color: colors.muted }}>{sub}</p>
          )}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
            style={{ background: accent + '14' }}
          >
            <Icon size={19} style={{ color: accent }} strokeWidth={1.8} />
          </div>
        )}
      </div>
    </Card>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1
          className="text-xl leading-tight"
          style={{ color: colors.dark, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: colors.muted }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}

const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold border cursor-pointer transition-all duration-200'

const btnVariants = {
  primary:   `text-white border-transparent`,
  secondary: `bg-white`,
  danger:    `text-red-700`,
  ghost:     `bg-transparent border-transparent`,
}
const btnSizes = {
  xs: 'px-3 py-1 text-xs rounded-lg',
  sm: 'px-3.5 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '', loading }) {
  const isPrimary = variant === 'primary'
  const isDanger = variant === 'danger'
  const isSecondary = variant === 'secondary'

  const style = {}
  if (isPrimary) {
    style.background = colors.brand
    style.boxShadow = '0 1px 2px rgba(76,204,221,0.3)'
  } else if (isDanger) {
    style.background = '#FEF2F2'
    style.borderColor = '#FECACA'
  } else if (isSecondary) {
    style.color = colors.dark
    style.borderColor = colors.border
  } else {
    style.color = colors.dark
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={style}
      onMouseEnter={e => {
        if (disabled || loading) return
        if (isPrimary) e.currentTarget.style.background = colors.brandDark
        else if (isSecondary) e.currentTarget.style.background = colors.hoverBg
        else if (isDanger) e.currentTarget.style.background = '#FEE2E2'
        else e.currentTarget.style.background = colors.hoverBg
      }}
      onMouseLeave={e => {
        if (isPrimary) e.currentTarget.style.background = colors.brand
        else if (isSecondary) e.currentTarget.style.background = '#fff'
        else if (isDanger) e.currentTarget.style.background = '#FEF2F2'
        else e.currentTarget.style.background = 'transparent'
      }}
    >
      {loading && (
        <span
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      )}
      {children}
    </button>
  )
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium" style={{ color: colors.muted }}>
          {label}
        </label>
      )}
      <input
        className="rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-200 w-full"
        style={{
          border: `1.5px solid ${error ? colors.danger : colors.inputBorder}`,
          background: '#fff',
          color: colors.dark,
        }}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: colors.danger }}>{error}</span>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium" style={{ color: colors.muted }}>
          {label}
        </label>
      )}
      <select
        className="rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-200 w-full"
        style={{
          border: `1.5px solid ${error ? colors.danger : colors.inputBorder}`,
          background: '#fff',
          color: colors.dark,
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs" style={{ color: colors.danger }}>{error}</span>}
    </div>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium" style={{ color: colors.muted }}>
          {label}
        </label>
      )}
      <textarea
        className="rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none transition-all duration-200 w-full"
        style={{
          border: `1.5px solid ${colors.inputBorder}`,
          background: '#fff',
          color: colors.dark,
        }}
        rows={4}
        {...props}
      />
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,25,23,0.45)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[92vh] flex flex-col`}
        style={{ boxShadow: '0 24px 48px rgba(28,25,23,0.16), 0 8px 16px rgba(28,25,23,0.08)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <h2
            className="text-lg"
            style={{ color: colors.dark, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{ color: colors.muted, background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = colors.hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export function DataTable({ columns, rows, loading, empty = 'No records found', renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col}
                className="px-4 py-3.5 text-left whitespace-nowrap font-medium uppercase tracking-wider"
                style={{
                  fontSize: 11,
                  color: colors.muted,
                  background: colors.hoverBg,
                  borderBottom: `1px solid ${colors.border}`,
                  letterSpacing: '0.05em',
                }}
              >
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
            <tr
              key={row.id ?? i}
              className="transition-colors duration-150"
              style={{ borderBottom: `1px solid ${colors.border}` }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5FAFB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
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
    <td
      className={`px-4 py-3.5 text-sm ${nowrap ? 'whitespace-nowrap' : ''}`}
      style={{
        color: muted ? colors.muted : colors.dark,
        fontWeight: bold ? 600 : 400,
        fontSize: mono ? 12 : 13,
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
      }}
    >
      {children}
    </td>
  )
}

export function Pagination({ page, totalPages, total, onChange }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 border-t"
      style={{ borderColor: colors.border }}
    >
      <p className="text-xs" style={{ color: colors.muted }}>
        Page {page + 1} of {totalPages}{total != null ? ` · ${total} records` : ''}
      </p>
      <div className="flex gap-2">
        <Btn variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
          ← Prev
        </Btn>
        <Btn variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
          Next →
        </Btn>
      </div>
    </div>
  )
}

export function Spinner({ center }) {
  const el = (
    <div
      className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: `${colors.brand}40`, borderTopColor: colors.brand }}
    />
  )
  if (!center) return el
  return <div className="flex items-center justify-center py-16">{el}</div>
}

export function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer"
      style={{
        background: active ? colors.brand : '#fff',
        color: active ? '#fff' : colors.muted,
        borderColor: active ? colors.brand : colors.border,
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.borderColor = colors.brand
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.borderColor = colors.border
      }}
    >
      {typeof label === 'string' ? labelify(label) : label}
    </button>
  )
}

export function Avatar({ name = '', src, size = 36, bg = colors.brandLight, color = colors.brandDark }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        color,
        fontSize: size * 0.34,
        letterSpacing: '0.02em',
      }}
    >
      {initials || '?'}
    </div>
  )
}

export function Empty({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
        style={{ background: colors.hoverBg }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={colors.muted} strokeWidth="1.5" strokeLinecap="round">
          <path d="M4 8h12M4 12h8" />
        </svg>
      </div>
      <p className="text-sm" style={{ color: colors.muted }}>{message || 'Nothing here yet'}</p>
    </div>
  )
}
