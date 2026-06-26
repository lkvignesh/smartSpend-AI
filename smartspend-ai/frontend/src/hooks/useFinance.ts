import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r: any) => r.data),
    refetchInterval: 60000,
  })

export const useExpenses = (month?: number, year?: number) =>
  useQuery({
    queryKey: ['expenses', month, year],
    queryFn: () => api.get('/expenses', { params: { month, year } }).then((r: any) => r.data),
  })

export const useCreateExpense = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (d: any) => api.post('/expenses', d).then((r: any) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteExpense = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => api.delete(`/expenses/${id}`).then((r: any) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useIncomes = () =>
  useQuery({
    queryKey: ['incomes'],
    queryFn: () => api.get('/incomes').then((r: any) => r.data),
  })

export const useCreateIncome = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (d: any) => api.post('/incomes', d).then((r: any) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incomes'] }),
  })
}

export const useGoals = () =>
  useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get('/goals').then((r: any) => r.data),
  })

export const useCreateGoal = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (d: any) => api.post('/goals', d).then((r: any) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export const useAIChat = () =>
  useMutation({
    mutationFn: (message: string) =>
      api.post('/ai/chat', { message }).then((r: any) => r.data),
  })
