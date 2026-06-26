import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  currency: string
}

interface AuthCtx {
  user: User | null
  isLoading: boolean
  login: (d: any) => void
  register: (d: any) => void
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
      const stored = localStorage.getItem('user')
      if (stored && stored !== 'undefined') {
        setUser(JSON.parse(stored))
      }
    } catch {
      localStorage.clear()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onSuccess = (data: any) => {
    if (!data?.access_token || !data?.user) return
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    setTimeout(() => navigate('/dashboard'), 100)
  }

  const { mutate: login } = useMutation({
    mutationFn: (d: any) => api.post('/auth/login', d).then((r: any) => r.data),
    onSuccess,
    onError: (err: any) => {
      throw err
    }
  })

  const { mutate: register } = useMutation({
    mutationFn: (d: any) => api.post('/auth/register', d).then((r: any) => r.data),
    onSuccess,
    onError: (err: any) => {
      throw err
    }
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
