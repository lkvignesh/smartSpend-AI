import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const FEATURES = [
  { Icon: TrendingUp, title: 'AI-powered insights', desc: 'Understand your spending with intelligent pattern recognition.' },
  { Icon: Shield,     title: 'Bank-grade security',  desc: 'Your financial data is encrypted end-to-end.' },
  { Icon: Zap,        title: 'Real-time tracking',   desc: 'Every rupee tracked instantly across all categories.' },
]

function Field({ label, type, error, toggle, showToggle, ...rest }: {
  label: string; type: string; error?: string
  toggle?: () => void; showToggle?: boolean; [k: string]: any
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--c-text2)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          className="w-full px-4 py-3 text-sm rounded-xl transition-colors focus:outline-none"
          style={{
            background: 'var(--c-s2)',
            border: `1px solid ${error ? '#EF4444' : 'var(--c-border)'}`,
            color: 'var(--c-text)',
          }}
          onFocus={e => (e.target.style.borderColor = error ? '#EF4444' : '#2563EB')}
          onBlur={e => (e.target.style.borderColor = error ? '#EF4444' : 'var(--c-border)')}
          {...rest}
        />
        {showToggle && toggle && (
          <button type="button" onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--c-text3)' }} tabIndex={-1}>
            {type === 'password' ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-[12px]" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
}

export default function Login() {
  const { login, loginPending } = useAuth()
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    setError('')
    login(data, { onError: () => setError('Invalid email or password. Please try again.') })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--c-bg)' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg, #0B0C28 0%, #0F1844 40%, #0D1435 100%)' }}>

        {/* Decorative orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">FinancePilot</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight mb-3 text-balance">
              Your finances,<br />finally intelligent.
            </h2>
            <p className="text-[15px] leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              AI-powered tracking that actually understands your money.
            </p>

            <div className="space-y-5">
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <Icon size={17} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom note */}
        <p className="relative z-10 text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Trusted by 10,000+ users across India
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--c-text)' }}>FinancePilot</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c-text)' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--c-text2)' }}>Sign in to your account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message as string}
              {...register('email', { required: 'Email is required' })}
            />
            <Field
              label="Password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message as string}
              showToggle
              toggle={() => setShowPw(v => !v)}
              {...register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-[#2563EB]" />
                <span className="text-[13px]" style={{ color: 'var(--c-text2)' }}>Remember me</span>
              </label>
              <Link to="/auth/forgot" tabIndex={-1}
                className="text-[13px] font-medium hover:underline"
                style={{ color: '#2563EB' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loginPending}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {loginPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--c-border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[12px]"
                style={{ background: 'var(--c-bg)', color: 'var(--c-text3)' }}>
                New to FinancePilot?
              </span>
            </div>
          </div>

          <Link to="/auth/register"
            className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[rgba(37,99,235,0.07)]"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-text)' }}>
            Create a free account
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
