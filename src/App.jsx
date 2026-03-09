import { AuthProvider, useAuth } from './features/auth/AuthContext'
import LoginPage from './features/auth/LoginPage'
import AppShell  from './AppShell'
import { Spinner } from './shared/components'

function Root() {
  const { user, ready } = useAuth()
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Spinner center /></div>
  return user ? <AppShell /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}
