import { useState } from 'react'
import { useAuth } from './AuthContext'
import { colors } from '../../shared/utils/colors'

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
      style={{ background: colors.bg }}
    >
      <div className="w-full max-w-[400px]">

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-base font-bold"
            style={{ background: colors.brand,  }}
          >
            M
          </div>
          <div>
            <p className="text-base font-bold leading-none" style={{ color: colors.dark,  }}>
              MindSpace
            </p>
            <p
              className="text-xs tracking-widest mt-0.5"
              style={{ color: colors.muted, fontSize: 9 }}
            >
              ADMIN PORTAL
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-3xl font-extrabold leading-tight mb-2"
            style={{ color: colors.dark,  }}
          >
            {needs2FA ? 'Verify your identity' : 'Welcome back'}
          </h1>
          <p className="text-sm" style={{ color: colors.muted,  }}>
            {needs2FA
              ? 'Enter the 6-digit OTP sent to your email'
              : 'Sign in to the admin portal'}
          </p>
        </div>

        {/* Error */}
        {err && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: '#fee2e2', color: '#991b1b',  }}
          >
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="flex flex-col gap-5">
          {!needs2FA ? (
            <>
              <Field label="Email address">
                <input
                  type="email"
                  placeholder="admin@mindspace.app"
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
                }}
              />
            </Field>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              background: busy ? colors.brandDark : colors.brand,
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '14px 0',
              fontSize: 14,
              fontWeight: 700,
              cursor: busy ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              opacity: busy ? 0.75 : 1,
              transition: 'opacity 0.15s',
              marginTop: 2,
            }}
          >
            {busy && (
              <span
                style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            )}
            {needs2FA ? 'Verify OTP' : 'Sign in'}
          </button>
        </form>

        <p
          className="mt-8 text-center text-xs"
          style={{ color: colors.muted,  }}
        >
          MindSpace · Admin Portal v1.0
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #9ca3af; }
        input:focus { border-color: ${colors.brand} !important; box-shadow: 0 0 0 3px ${colors.brand}22; }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: colors.muted,  }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 12,
  border: '1.5px solid #CFD3D5',
  background: '#fff',
  color: '#1a2332',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
