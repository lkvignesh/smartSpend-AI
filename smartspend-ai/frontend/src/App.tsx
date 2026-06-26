import { Component, ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import Expenses from '@/pages/expenses/Expenses'
import Goals from '@/pages/goals/Goals'
import AIAdvisor from '@/pages/ai/AIAdvisor'

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }

  static getDerivedStateFromError(e: Error) {
    return { error: String(e.message || 'Unknown error') }
  }

  componentDidCatch(e: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', e.message)
    console.error(info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#08080F] p-6">
          <p className="text-lg font-semibold text-[#FF5C7C]">Something went wrong</p>
          <p className="text-sm text-[#8A8AA0] max-w-sm text-center">{this.state.error}</p>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/auth/login' }}
            className="px-6 py-2.5 rounded-xl text-white font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
          >
            Back to login
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080F]">
        <p className="text-[#8A8AA0]">Loading…</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/auth/login" replace />
  return <AppLayout>{children}</AppLayout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login"    element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses"  element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/goals"     element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/ai"        element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
      <Route path="/"   element={<Navigate to="/dashboard" replace />} />
      <Route path="*"   element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
