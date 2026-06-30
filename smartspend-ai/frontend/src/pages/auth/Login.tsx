import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Shield, Zap, BarChart3, Brain } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const FEATURES = [
  { icon: Brain,    label: 'AI-Powered Insights',  desc: 'Get personalised financial advice' },
  { icon: Shield,   label: 'Bank-Level Security',  desc: 'Your data is encrypted and safe' },
  { icon: BarChart3, label: 'Smart Analytics',     desc: 'Understand your money deeply' },
  { icon: Zap,      label: 'Real-Time Tracking',   desc: 'See spending as it happens' },
]

/* Animated background orbs */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
    </div>
  )
}

/* Stats ticker */
function StatTicker() {
  const stats = [
    { value: '₹2.4L', label: 'Avg. savings/mo' },
    { value: '12K+',  label: 'Active users' },
    { value: '94%',   label: 'Satisfaction rate' },
    { value: '3.2x',  label: 'Avg. savings growth' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 mt-8">
      {stats.map(({ value, label }) => (
        <div key={label} className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[20px] font-bold text-white num">{value}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
        </div>
      ))}
    </div>
  )
}

export default function Login() {
  const { login, loginPending } = useAuth()
  const [loginError, setLoginError] = useState('')
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<{ email: string; password: string }>()

  const onSubmit = handleSubmit(data => {
    setLoginError('')
    login(data, {
      onError: (e: any) => setLoginError(
        e?.response?.data?.detail || 'Invalid credentials. Please try again.'
      ),
    })
  })

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel — hero ──────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0F1844 50%, #0A0F28 100%)' }}>
        <BackgroundOrbs />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--grad)' }}>
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-[18px] tracking-tight">FinancePilot</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: 'rgba(59,130,246,0.3)', border: '1px solid rgba(59,130,246,0.4)' }}>
            AI
          </span>
        </motion.div>

        {/* Main copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="t-label mb-4" style={{ color: 'rgba(59,130,246,0.8)' }}>
              Your AI Financial Copilot
            </p>
            <h2 className="text-[48px] font-bold text-white leading-[1.08] tracking-tight mb-5">
              Take control of your{' '}
              <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                financial future.
              </span>
            </h2>
            <p className="text-[16px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              The only finance app that thinks with you. Track, plan, and grow your wealth with AI-powered guidance.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.35 }}
                  className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Icon size={14} style={{ color: '#3B82F6' }} />
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-white">{label}</span>
                    <span className="text-[13px] ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>— {desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <StatTicker />
          </motion.div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 t-small" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Trusted by thousands of users across India
        </p>
      </div>

      {/* ── Right panel — form ─────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--grad)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-[16px]" style={{ color: 'var(--text)' }}>FinancePilot</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="t-section font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
              Welcome back
            </h1>
            <p className="t-body" style={{ color: 'var(--text2)' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3.5 rounded-xl t-body"
              style={{
                background: 'var(--danger-dim)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: 'var(--danger)',
              }}>
              {loginError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message as string}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message as string}
              {...register('password', { required: 'Password is required' })}
            />

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[var(--primary)]" />
                <span className="t-body" style={{ color: 'var(--text2)' }}>Remember me</span>
              </label>
              <Link to="#" className="t-body font-medium transition-colors hover:underline"
                style={{ color: 'var(--primary)' }}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loginPending}
              size="lg"
              className="mt-2">
              Sign in to FinancePilot
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border2)' }} />
            <span className="t-small" style={{ color: 'var(--text3)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border2)' }} />
          </div>

          {/* Sign up CTA */}
          <p className="text-center t-body" style={{ color: 'var(--text2)' }}>
            Don't have an account?{' '}
            <Link to="/auth/register"
              className="font-semibold hover:underline"
              style={{ color: 'var(--primary)' }}>
              Create one free
            </Link>
          </p>

          <p className="text-center t-small mt-6" style={{ color: 'var(--text3)' }}>
            By signing in, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  )
}
