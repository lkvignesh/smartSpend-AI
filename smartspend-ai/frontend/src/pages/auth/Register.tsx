import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function Register() {
  const { register: signup } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data: any) => {
    setError('')
    try { await (signup as any)(data) }
    catch (e: any) { setError(e?.response?.data?.detail || 'Registration failed') }
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
            <Typography color="text.secondary" sx={{ mt: 1 }}>Create your free account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Full name" margin="normal"
              {...register('full_name', { required: 'Name is required' })}
              error={!!errors.full_name} helperText={errors.full_name?.message as string} />
            <TextField fullWidth label="Email" type="email" margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email} helperText={errors.email?.message as string} />
            <TextField fullWidth label="Password" type="password" margin="normal"
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
              error={!!errors.password} helperText={errors.password?.message as string} />
            <TextField fullWidth label="Confirm password" type="password" margin="normal"
              {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })}
              error={!!errors.confirm} helperText={errors.confirm?.message as string} />
            <Button fullWidth variant="contained" size="large" type="submit" disabled={isSubmitting}
              sx={{ mt: 3, py: 1.5, fontSize: 16 }}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <Typography align="center" color="text.secondary" fontSize={14} sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/auth/login" underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
