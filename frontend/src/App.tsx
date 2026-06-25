import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { apiClient } from './api/client'
import Spinner from './components/ui/Spinner'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const AppPage = lazy(() => import('./pages/AppPage'))

function Guard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const navigate = useNavigate()

  // sso_token from redirect URL, or existing stored token needing user hydration
  const ssoToken = new URLSearchParams(window.location.search).get('sso_token')
  const storedToken = localStorage.getItem('mv_token')
  const needsHydration = !user && (!!ssoToken || !!storedToken)

  const [checking, setChecking] = useState(needsHydration)

  useEffect(() => {
    if (!needsHydration) return
    const token = ssoToken || storedToken!
    if (ssoToken) window.history.replaceState({}, '', window.location.pathname)
    apiClient.get('/user/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setUser(data, token); setChecking(false); navigate('/app', { replace: true }) })
      .catch(() => { localStorage.removeItem('mv_token'); setChecking(false); navigate('/login', { replace: true }) })
  }, [])

  if (checking) return <div className="flex h-screen items-center justify-center"><Spinner /></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RootRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/app${search}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner /></div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<Guard><AppPage /></Guard>} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
