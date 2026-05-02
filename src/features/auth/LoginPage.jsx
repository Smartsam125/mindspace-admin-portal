import { useState } from 'react'
import { useAuth } from './AuthContext'
import { colors } from '../../shared/utils/colors'
import { Fingerprint } from 'lucide-react'
import logoSplash from '/assets/logo_splash.png'

export default function LoginPage() {
  const { login, verify2fa, needs2FA } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [otp,      setOtp]      = useState('')
  const [busy,     setBusy]     = useState(false)
  const [err,      setErr]      = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      needs2FA ? await verify2fa(otp) : await login(email, password)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: `linear-gradient(145deg, ${colors.bg} 0%, #EDE9E3 100%)` }}
    >
      <div className="w-full max-w-[400px]">

        <div className="flex flex-col items-center mb-10">
          <img
            src={logoSplash}
            alt="MindSpace"
            style={{ height: 72, objectFit: 'contain', marginBottom: 16 }}
          />
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 24,
              fontWeight: 500,
              color: colors.dark,
            }}
          >
            MindSpace
          </span>
          <span
            className="mt-1"
            style={{ fontSize: 11, color: colors.muted, letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Admin Portal
          </span>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: '#fff',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 24px rgba(28,25,23,0.06), 0 1px 3px rgba(28,25,23,0.04)',
          }}
        >
          <div className="text-center mb-7">
            <h1
              className="text-xl leading-tight mb-1.5"
              style={{
                color: colors.dark,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 500,
              }}
            >
              {needs2FA ? 'Verify your identity' : 'Welcome back'}
            </h1>
            <p className="text-sm" style={{ color: colors.muted }}>
              {needs2FA
                ? 'Enter the 6-digit code sent to your email'
                : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          {err && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              {err}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            {!needs2FA ? (
              <>
                <Field label="Email address">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </Field>

                <Field label="Password">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </Field>

                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer transition-colors duration-200"
                    style={{ fontSize: 13, fontWeight: 500, color: colors.brand, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = colors.brandDark}
                    onMouseLeave={e => e.currentTarget.style.color = colors.brand}
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              <Field label="OTP Code">
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  style={{
                    ...inputStyle,
                    textAlign: 'center',
                    fontSize: 26,
                    letterSpacing: '0.35em',
                    fontFamily: "'Fraunces', Georgia, serif",
                  }}
                />
              </Field>
            )}

            <button
              type="submit"
              disabled={busy}
              className="transition-all duration-200"
              style={{
                background: busy ? colors.brandDark : colors.brand,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 0',
                fontSize: 14,
                fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                opacity: busy ? 0.75 : 1,
                marginTop: 4,
                boxShadow: '0 2px 8px rgba(76,204,221,0.25)',
              }}
              onMouseEnter={e => { if (!busy) e.currentTarget.style.background = colors.brandDark }}
              onMouseLeave={e => { if (!busy) e.currentTarget.style.background = colors.brand }}
            >
              {busy && (
                <span
                  className="animate-spin"
                  style={{
                    width: 14, height: 14,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
              )}
              {needs2FA ? 'Verify OTP' : 'Sign in'}
            </button>
          </form>

          {!needs2FA && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: colors.border }} />
                <span className="text-xs" style={{ color: colors.muted }}>or</span>
                <div className="flex-1 h-px" style={{ background: colors.border }} />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
                style={{
                  background: '#fff',
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: '13px 0',
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.dark,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = colors.hoverBg
                  e.currentTarget.style.borderColor = colors.inputBorder
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = colors.border
                }}
              >
                <Fingerprint size={18} color={colors.muted} strokeWidth={1.8} />
                Sign in with Passkey
              </button>
            </>
          )}
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: colors.muted }}
        >
          Protected by end-to-end encryption
        </p>
      </div>

      <style>{`
        input::placeholder { color: #A8A29E; }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: colors.muted }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: `1.5px solid ${colors.inputBorder}`,
  background: '#FAFAF8',
  color: colors.dark,
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
}
