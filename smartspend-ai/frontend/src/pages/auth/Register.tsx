import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'

export default function Register() {
  const { register: signup, registerPending } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    setError('')
    const { confirm: _confirm, ...payload } = data
    signup(payload, {
      onError: (e: any) => setError(e?.response?.data?.detail || 'Registration failed'),
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #13131A 50%, #1A1A2E 100%)' }}>
      <div className="w-full max-w-[440px] rounded-2xl p-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
            SmartSpend AI
          </h1>
          <p className="text-[#8A8AA0] mt-2 text-sm">Create your free account</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF5C7C]/10 border border-[#FF5C7C]/20 text-[#FF5C7C] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8A8AA0] mb-1.5">Full name</label>
            <input
              type="text"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors"
              placeholder="Jane Doe"
              {...register('full_name', { required: 'Name is required' })}
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-[#FF5C7C]">{String(errors.full_name.message ?? '')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8AA0] mb-1.5">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[#FF5C7C]">{String(errors.email.message ?? '')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8AA0] mb-1.5">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors"
              placeholder="Min 8 characters"
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[#FF5C7C]">{String(errors.password.message ?? '')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8A8AA0] mb-1.5">Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors"
              placeholder="••••••••"
              {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })}
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-[#FF5C7C]">{String(errors.confirm.message ?? '')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerPending}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
          >
            {registerPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8A8AA0] mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-[#6C63FF] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
