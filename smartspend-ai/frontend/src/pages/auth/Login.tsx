import { useState, forwardRef } from 'react'
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

const Field = forwardRef<HTMLInputElement, {
  label: string; type: string; error?: string
  toggle?: () => void; showToggle?: boolean; [k: string]: any
}>(function Field({ label, type, error, toggle, showToggle, ...rest }, ref) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-2" style={{ color: 'var(--c-text2)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className="form-input w-full px-4 text-[15px] rounded-xl focus:outline-none"
          style={{
            background: 'var(--c-s2)',
            color: 'var(--c-text)',
            paddingRight: showToggle ? '48px' : undefined,
            borderColor: error ? '#EF4444' : undefined,
          }}
          {...rest}
        />
        {showToggle && toggle && (
          <button type="button" onClick={toggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--c-text3)' }} tabIndex={-1}>
            {type === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-[12px]" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
})

export default function Login() {
  const { login, loginPending } = useAuth()
  const [loginError, setLoginError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    setLoginError('')
    login(data, { onError: () => setLoginError('Invalid email or password. Please try again.') })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--c-bg)' }}>

      {/* ── Left hero panel ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(145deg, #0B0C28 0%, #0F1844 40%, #0D1435 100%)' }}>

        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute top-[45%] right-[8%] w-[200px] h-[200px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="text-white font-bold text-[18px]">FinancePilot</span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}>
            <h2 className="text-[44px] font-bold text-white leading-tight mb-4 tracking-tight text-balance">
              Your finances,<br />finally intelligent.
            </h2>
            <p className="text-[16px] leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.50)' }}>
              AI-powered tracking that actually understands your money.
            </p>

            <div className="space-y-5">
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 + i * 0.1 }}
                  className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                    <Icon size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white leading-tight">{title}</p>
                    <p className="text-[13px] mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.40)' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="relative z-10 text-[13px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Trusted by 10,000+ users across India
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-[16px]" style={{ color: 'var(--c-text)' }}>FinancePilot</span>
          </div>

          <h1 className="text-[32px] font-bold tracking-tight mb-1.5" style={{ color: 'var(--c-text)' }}>
            Welcome back
          </h1>
          <p className="text-[15px] mb-8" style={{ color: 'var(--c-text2)' }}>Sign in to your account</p>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3.5 rounded-xl text-[14px]"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {loginError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" />
                <span className="text-[14px]" style={{ color: 'var(--c-text2)' }}>Remember me</span>
              </label>
              <Link to="/auth/forgot" tabIndex={-1}
                className="text-[14px] font-semibold hover:underline"
                style={{ color: '#2563EB' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loginPending} className="btn-primary w-full mt-2">
              {loginPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--c-border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[13px]" style={{ background: 'var(--c-bg)', color: 'var(--c-text3)' }}>
                New to FinancePilot?
              </span>
            </div>
          </div>

          <Link to="/auth/register"
            className="btn-ghost w-full">
            Create a free account
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
