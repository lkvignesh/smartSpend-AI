import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, Divider, TextField, Typography, Link, Alert } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data: any) => {
    setError('')
    try { await (login as any)(data) }
    catch { setError('Invalid email or password') }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
      background: 'linear-gradient(135deg, #0A0A0F 0%, #13131A 50%, #1A1A2E 100%)' }}>
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SmartSpend AI
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Your AI financial copilot</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Email" type="email" margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email} helperText={errors.email?.message as string} />
            <TextField fullWidth label="Password" type="password" margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password} helperText={errors.password?.message as string} />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link component={RouterLink} to="/auth/forgot-password" underline="hover" sx={{ fontSize: 14, color: 'primary.main' }}>
                Forgot password?
              </Link>
            </Box>
            <Button fullWidth variant="contained" size="large" type="submit" disabled={isSubmitting}
              sx={{ mt: 3, py: 1.5, fontSize: 16 }}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}><Typography variant="caption" color="text.secondary">or</Typography></Divider>

          <Typography align="center" color="text.secondary" fontSize={14}>
            No account?{' '}
            <Link component={RouterLink} to="/auth/register" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Create one free
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
