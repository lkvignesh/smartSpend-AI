import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export const useExpenses = (month?: number, year?: number) =>
  useQuery({ queryKey: ['expenses', month, year], queryFn: () => api.get('/expenses', { params: { month, year } }).then(r => r.data) })

export const useCreateExpense = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/expenses', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  })
}

export const useDeleteExpense = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/expenses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  })
}

export const useIncomes = () =>
  useQuery({ queryKey: ['incomes'], queryFn: () => api.get('/incomes').then(r => r.data) })

export const useCreateIncome = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/incomes', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incomes'] }),
  })
}

export const useDashboard = () =>
  useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/dashboard').then(r => r.data), refetchInterval: 60000 })

export const useGoals = () =>
  useQuery({ queryKey: ['goals'], queryFn: () => api.get('/goals').then(r => r.data) })

export const useCreateGoal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/goals', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export const useAIChat = () =>
  useMutation({ mutationFn: (message: string) => api.post('/ai/chat', { message }).then(r => r.data) })
