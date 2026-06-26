import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

interface User {
  id: string
  email: string
  full_name: string
  currency: string
}

interface AuthCtx {
  user: User | null
  isLoading: boolean
  login: (d: { email: string; password: string }) => void
  register: (d: { email: string; password: string; full_name: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const qc = useQueryClient()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.avatar_url === null) {
          delete parsed.avatar_url
          localStorage.setItem('user', JSON.stringify(parsed))
        }
      }
    } catch {
      localStorage.removeItem('user')
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw && raw !== 'undefined' && raw !== 'null') {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && parsed.id) {
          setUser({
            id: String(parsed.id),
            email: String(parsed.email || ''),
            full_name: String(parsed.full_name || ''),
            currency: String(parsed.currency || 'INR'),
          })
        }
      }
    } catch {
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onSuccess = (data: any) => {
    if (!data?.access_token) return
    const u = data.user
    const safeUser: User = {
      id: String(u.id || ''),
      email: String(u.email || ''),
      full_name: String(u.full_name || ''),
      currency: String(u.currency || 'INR'),
    }
    localStorage.setItem('access_token', String(data.access_token))
    localStorage.setItem('refresh_token', String(data.refresh_token))
    localStorage.setItem('user', JSON.stringify(safeUser))
    setUser(safeUser)
    setTimeout(() => navigate('/dashboard'), 50)
  }

  const { mutate: login } = useMutation({
    mutationFn: (d: any) => api.post('/auth/login', d).then((r: any) => r.data),
    onSuccess,
  })

  const { mutate: register } = useMutation({
    mutationFn: (d: any) => api.post('/auth/register', d).then((r: any) => r.data),
    onSuccess,
  })

  const logout = () => {
    localStorage.clear()
    setUser(null)
    qc.clear()
    navigate('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
