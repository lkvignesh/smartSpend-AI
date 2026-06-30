import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, CheckCircle, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { useAuth } from '@/hooks/useAuth'

/* ── Password strength bar ── */
function StrengthBar({ pw }: { pw: string }) {
  if (!pw) return null
  const checks = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
  const score   = checks.filter(r => r.test(pw)).length
  const colors  = ['', '#EF4444', '#F59E0B', '#10B981', '#3B82F6']
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'var(--border3)' }} />
        ))}
      </div>
      <p className="t-small font-semibold" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  )
}

/* ── Step indicator ── */
function Steps({ current }: { current: number }) {
  const steps = ['Your info', 'Password', 'Done']
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300"
                style={{
                  background: done ? 'var(--success)' : active ? 'var(--grad)' : 'var(--card2)',
                  color: (done || active) ? 'white' : 'var(--text3)',
                }}>
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="t-small font-medium hidden sm:block"
                style={{ color: active ? 'var(--text)' : 'var(--text3)' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 h-px mx-1 transition-all duration-500"
                style={{ background: i < current ? 'var(--success)' : 'var(--border2)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

type Step1 = { full_name: string; email: string }
type Step2 = { password: string; confirm: string }

export default function Register() {
  const { register: signup, registerPending } = useAuth()
  const [step, setStep]         = useState(0)
  const [step1Data, setStep1]   = useState<Step1 | null>(null)
  const [regError, setRegError] = useState('')

  const form1 = useForm<Step1>()
  const form2 = useForm<Step2>()
  const pw    = form2.watch('password', '')

  const handleStep1 = form1.handleSubmit(data => {
    setStep1(data)
    setStep(1)
  })

  const handleStep2 = form2.handleSubmit(data => {
    if (!step1Data) return
    setRegError('')
    signup({ ...step1Data, password: data.password }, {
      onError: (e: any) => setRegError(
        e?.response?.data?.detail || 'Registration failed. Please try again.'
      ),
    })
  })

  const SLIDE = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-center items-center p-14"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0F1844 50%, #0A0F28 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-12"
            style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--grad)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <h2 className="text-[36px] font-bold text-white leading-tight tracking-tight mb-4">
            Start your financial journey today.
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Join thousands who've transformed their finances with AI-powered insights.
          </p>

          {/* Progress indicator */}
          <div className="mt-10">
            <div className="flex justify-between t-small mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span>Setup progress</span>
              <span>{Math.round(((step + 1) / 3) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--grad)' }}
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--grad)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-[16px]" style={{ color: 'var(--text)' }}>FinancePilot</span>
          </div>

          <Steps current={step} />

          {/* Error */}
          {regError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3.5 rounded-xl t-body"
              style={{
                background: 'var(--danger-dim)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: 'var(--danger)',
              }}>
              {regError}
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={step}>
            {step === 0 && (
              <motion.form
                key="step0"
                custom={1}
                variants={SLIDE}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onSubmit={handleStep1}
                className="space-y-6">
                <div>
                  <h1 className="t-section font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                    Create account
                  </h1>
                  <p className="t-body" style={{ color: 'var(--text2)' }}>
                    Tell us a bit about yourself
                  </p>
                </div>
                <Input
                  label="Full name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  error={form1.formState.errors.full_name?.message as string}
                  {...form1.register('full_name', { required: 'Full name is required' })}
                />
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  error={form1.formState.errors.email?.message as string}
                  {...form1.register('email', { required: 'Email is required' })}
                />
                <Button type="submit" variant="primary" fullWidth size="lg">
                  Continue →
                </Button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.form
                key="step1"
                custom={1}
                variants={SLIDE}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onSubmit={handleStep2}
                className="space-y-6">
                <div>
                  <h1 className="t-section font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                    Secure your account
                  </h1>
                  <p className="t-body" style={{ color: 'var(--text2)' }}>
                    Create a strong password
                  </p>
                </div>
                <div>
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    error={form2.formState.errors.password?.message as string}
                    {...form2.register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Must be at least 8 characters' },
                    })}
                  />
                  <StrengthBar pw={pw} />
                </div>
                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  error={form2.formState.errors.confirm?.message as string}
                  {...form2.register('confirm', {
                    validate: v => v === pw || 'Passwords do not match',
                  })}
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-[var(--primary)] shrink-0" />
                  <span className="t-body leading-relaxed" style={{ color: 'var(--text2)' }}>
                    I agree to the{' '}
                    <a href="#" className="font-semibold" style={{ color: 'var(--primary)' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="font-semibold" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
                  </span>
                </label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(0)}>
                    <ArrowLeft size={15} /> Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={registerPending}
                    size="lg"
                    className="flex-1">
                    Create account
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center t-body mt-8" style={{ color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
