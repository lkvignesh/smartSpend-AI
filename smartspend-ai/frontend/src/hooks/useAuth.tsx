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
  login: (d: any, opts?: any) => void
  register: (d: any, opts?: any) => void
  loginPending: boolean
  registerPending: boolean
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

function parseUser(raw: string): User | null {
  try {
    const p = JSON.parse(raw)
    if (!p || typeof p !== 'object' || !p.id) return null
    return {
      id: String(p.id || ''),
      email: String(p.email || ''),
      full_name: String(p.full_name || ''),
      currency: String(p.currency || 'INR'),
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const qc = useQueryClient()

  // Clean up any stale null values from old sessions
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && 'avatar_url' in parsed) {
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
        const u = parseUser(raw)
        if (u) setUser(u)
      }
    } catch {
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onAuthSuccess = (data: any) => {
    if (!data?.access_token || !data?.user) return
    const u = data.user
    const safe: User = {
      id: String(u.id || ''),
      email: String(u.email || ''),
      full_name: String(u.full_name || ''),
      currency: String(u.currency || 'INR'),
    }
    localStorage.setItem('access_token', String(data.access_token))
    localStorage.setItem('refresh_token', String(data.refresh_token || ''))
    localStorage.setItem('user', JSON.stringify(safe))
    setUser(safe)
    setTimeout(() => navigate('/dashboard'), 100)
  }

  const loginMut = useMutation({
    mutationFn: (d: any) => api.post('/auth/login', d).then((r: any) => r.data),
    onSuccess: onAuthSuccess,
  })

  const registerMut = useMutation({
    mutationFn: (d: any) => api.post('/auth/register', d).then((r: any) => r.data),
    onSuccess: onAuthSuccess,
  })

  const logout = () => {
    localStorage.clear()
    setUser(null)
    qc.clear()
    navigate('/auth/login')
  }

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      login: loginMut.mutate,
      register: registerMut.mutate,
      loginPending: loginMut.isPending,
      registerPending: registerMut.isPending,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
