import { useState } from 'react'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import LoginPage from './features/auth/LoginPage'
import LandingPage from './features/landing/LandingPage'
import AppShell  from './AppShell'
import { Spinner } from './shared/components'

function Root() {
  const { user, ready } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Spinner center /></div>
  if (user) return <AppShell />
  if (showLogin) return <LoginPage />
  return <LandingPage onSignIn={() => setShowLogin(true)} />
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}
