import { useState } from 'react'
import { Box, Button, Card, CardContent, Typography, Grid, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { useForm } from 'react-hook-form'
import { useGoals, useCreateGoal } from '@/hooks/useFinance'

export default function Goals() {
  const { data: goals, isLoading } = useGoals()
  const createGoal = useCreateGoal()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data: any) => {
    createGoal.mutate({ ...data, target_amount: parseFloat(data.target_amount), current_amount: parseFloat(data.current_amount || 0) })
    setOpen(false)
    reset()
  }

  const progress = (current: number, target: number) => Math.min(100, (current / target) * 100)

  const COLORS = ['#6C63FF','#00D4AA','#FFB547','#FF5C7C','#4ECDC4']

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Goals</Typography>
          <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>Track your financial milestones</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>New goal</Button>
      </Box>

      {!isLoading && goals?.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <TrackChangesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No goals yet. Set your first financial goal!</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setOpen(true)}>Create goal</Button>
        </Card>
      )}

      <Grid container spacing={2.5}>
        {goals?.map((g: any, i: number) => {
          const pct = progress(g.current_amount, g.target_amount)
          const color = COLORS[i % COLORS.length]
          const remaining = g.target_amount - g.current_amount
          return (
            <Grid item xs={12} sm={6} lg={4} key={g.id}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography fontWeight={600}>{g.title}</Typography>
                    <Typography fontSize={13} color="text.secondary" fontWeight={500}>{Math.round(pct)}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography fontSize={11} color="text.secondary">Saved</Typography>
                      <Typography fontWeight={600} fontSize={15} sx={{ color }}>₹{g.current_amount.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography fontSize={11} color="text.secondary">Target</Typography>
                      <Typography fontWeight={600} fontSize={15}>₹{g.target_amount.toLocaleString('en-IN')}</Typography>
                    </Box>
                  </Box>
                  {remaining > 0 && (
                    <Typography fontSize={12} color="text.secondary" sx={{ mt: 1.5 }}>
                      ₹{remaining.toLocaleString('en-IN')} remaining
                      {g.target_date && ` · Due ${new Date(g.target_date).toLocaleDateString('en-IN')}`}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={600}>Create goal</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField fullWidth label="Goal name" {...register('title', { required: true })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Target amount (₹)" type="number" {...register('target_amount', { required: true })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Amount saved so far (₹)" type="number" defaultValue={0} {...register('current_amount')} sx={{ mb: 2 }} />
            <TextField fullWidth label="Target date" type="date" InputLabelProps={{ shrink: true }} {...register('target_date')} sx={{ mb: 2 }} />
            <TextField fullWidth label="Notes" multiline rows={2} {...register('notes')} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button type="submit" variant="contained">Create goal</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
