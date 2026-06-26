import { useState } from 'react'
import { Box, Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, Chip, IconButton, Skeleton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm } from 'react-hook-form'
import { useExpenses, useCreateExpense, useDeleteExpense } from '@/hooks/useFinance'

const CATEGORIES = [
  { id: '1', name: 'Food', color: '#FF5C7C' }, { id: '2', name: 'Travel', color: '#FFB547' },
  { id: '3', name: 'Shopping', color: '#6C63FF' }, { id: '4', name: 'Entertainment', color: '#00D4AA' },
  { id: '5', name: 'Healthcare', color: '#4ECDC4' }, { id: '6', name: 'Utilities', color: '#95A5A6' },
  { id: '7', name: 'Education', color: '#3498DB' }, { id: '8', name: 'Other', color: '#BDC3C7' },
]

const PAYMENT_METHODS = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']

export default function Expenses() {
  const { data: expenses, isLoading } = useExpenses()
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    createExpense.mutate({ ...data, amount: parseFloat(data.amount), date: new Date(data.date).toISOString() })
    setOpen(false)
    reset()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Expenses</Typography>
          <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>Track every rupee you spend</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add expense</Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ p: 3 }}>{[1,2,3,4,5].map(i => <Skeleton key={i} height={60} sx={{ mb: 1, borderRadius: 2 }} />)}</Box>
          ) : expenses?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No expenses yet. Add your first one!</Typography>
              <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setOpen(true)}>Add expense</Button>
            </Box>
          ) : expenses?.map((e: any, idx: number) => {
            const cat = CATEGORIES.find(c => c.name === e.category?.name)
            return (
              <Box key={e.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2,
                borderBottom: idx < expenses.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${cat?.color || '#6C63FF'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography fontSize={18}>💸</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={500} fontSize={14}>{e.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.3 }}>
                    <Typography fontSize={12} color="text.secondary">{new Date(e.date).toLocaleDateString('en-IN')}</Typography>
                    {e.merchant && <Typography fontSize={12} color="text.secondary">· {e.merchant}</Typography>}
                    {e.payment_method && <Typography fontSize={12} color="text.secondary">· {e.payment_method}</Typography>}
                  </Box>
                </Box>
                {e.category && <Chip label={e.category.name || 'Other'} size="small" sx={{ bgcolor: `${cat?.color || '#6C63FF'}22`, color: cat?.color || '#6C63FF', fontWeight: 500, fontSize: 11 }} />}
                <Typography fontWeight={700} sx={{ color: '#FF5C7C', minWidth: 80, textAlign: 'right' }}>₹{e.amount.toLocaleString('en-IN')}</Typography>
                <IconButton size="small" onClick={() => deleteExpense.mutate(e.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          })}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper' } }}>
        <DialogTitle fontWeight={600}>Add expense</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Title" {...register('title', { required: true })} error={!!errors.title} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Amount (₹)" type="number" {...register('amount', { required: true, min: 0 })} error={!!errors.amount} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} defaultValue={new Date().toISOString().split('T')[0]} {...register('date', { required: true })} /></Grid>
              <Grid item xs={6}>
                <TextField fullWidth select label="Payment method" defaultValue="UPI" {...register('payment_method')}>
                  {PAYMENT_METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}><TextField fullWidth label="Merchant" {...register('merchant')} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Notes" multiline rows={2} {...register('notes')} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createExpense.isPending}>
              {createExpense.isPending ? 'Saving...' : 'Save expense'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
