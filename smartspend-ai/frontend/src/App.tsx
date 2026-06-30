import { Component, ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/ui/Toast'
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
  static getDerivedStateFromError(e: Error) { return { error: String(e.message) } }
  componentDidCatch(e: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', e.message, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-6"
          style={{ background: 'var(--c-bg)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚡
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1" style={{ color: 'var(--c-text)' }}>Something went wrong</p>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--c-text2)' }}>
              {this.state.error}
            </p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/auth/login' }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
        <div className="w-6 h-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
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
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={qc}>
            <BrowserRouter>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
