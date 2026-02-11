import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/auth'
import Auth from './pages/Auth'
import Feed from './pages/Feed'
import Chats from './pages/Chats'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Bots from './pages/Bots'
import Groups from './pages/Groups'
import Layout from './components/Layout'

const queryClient = new QueryClient()

function App() {
  const { token } = useAuthStore()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={token ? <Layout /> : <Navigate to="/auth" />}>
            <Route path="/" element={<Feed />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bots" element={<Bots />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function AuthCallback() {
  const { setAuth } = useAuthStore()
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  
  if (token) {
    // В реальном приложении получить данные пользователя
    setAuth(token, { id: '', username: '', displayName: '' })
  }
  
  return <Navigate to="/" />
}

export default App
