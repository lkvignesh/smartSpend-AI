import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useState } from 'react'
import { darkTheme, lightTheme } from '@/theme'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import Expenses from '@/pages/expenses/Expenses'
import Goals from '@/pages/goals/Goals'
import AIAdvisor from '@/pages/ai/AIAdvisor'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } })

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/auth/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  const [dark] = useState(true)
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
