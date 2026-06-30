import { useState, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Sparkles, Check, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function StrengthBar({ pw }: { pw: string }) {
  const score = !pw ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
        .filter(r => r.test(pw)).length

  const colors = ['', '#EF4444', '#F59E0B', '#10B981', '#2563EB']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!pw) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: i <= score ? colors[score] : 'var(--c-border)' }} />
        ))}
      </div>
      <p className="text-[12px] font-semibold" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  )
}

const Field = forwardRef<HTMLInputElement, {
  label: string; type: string; error?: string; hint?: string
  toggle?: () => void; showToggle?: boolean; [k: string]: any
}>(function Field({ label, type, error, toggle, showToggle, hint, ...rest }, ref) {
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
          <button type="button" onClick={toggle} tabIndex={-1}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--c-text3)' }}>
            {type === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-[12px]" style={{ color: 'var(--c-text3)' }}>{hint}</p>}
      {error && <p className="mt-1.5 text-[12px]" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
})

const STEPS = [
  { label: 'Your info',     step: 1 },
  { label: 'Set password',  step: 2 },
]

const BENEFITS = [
  'Free forever, upgrade any time',
  'No credit card required',
  'Bank-level data encryption',
]

export default function Register() {
  const { register: signup, registerPending } = useAuth()
  const [step, setStep]     = useState(1)
  const [regError, setRegError] = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step1Data, setStep1Data]   = useState<{ full_name: string; email: string } | null>(null)

  const form1 = useForm()
  const form2 = useForm()
  const pw = form2.watch('password', '')

  const handleStep1 = form1.handleSubmit(data => {
    setStep1Data({ full_name: data.full_name, email: data.email })
    setStep(2)
  })

  const handleStep2 = form2.handleSubmit(data => {
    if (!step1Data) return
    setRegError('')
    signup({ ...step1Data, password: data.password }, {
      onError: (e: any) => setRegError(e?.response?.data?.detail || 'Registration failed. Please try again.'),
    })
  })

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--c-bg)' }}>

      {/* ── Left panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(145deg, #0B0C28 0%, #0F1844 40%, #0D1435 100%)' }}>
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="text-white font-bold text-[18px]">FinancePilot</span>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}>
            <h2 className="text-[44px] font-bold text-white leading-tight mb-4 tracking-tight text-balance">
              Take control of your money.
            </h2>
            <p className="text-[16px] mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Join thousands who've transformed their financial habits with AI.
            </p>
            <div className="space-y-4">
              {BENEFITS.map((item, i) => (
                <motion.div key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.09 }}
                  className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)' }}>
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.60)' }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <p className="relative z-10 text-[13px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Set up takes less than 2 minutes
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-[16px]" style={{ color: 'var(--c-text)' }}>FinancePilot</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map(({ label, step: s }, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all"
                  style={{
                    background: s <= step ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'var(--c-s2)',
                    color: s <= step ? 'white' : 'var(--c-text3)',
                    border: s <= step ? 'none' : '1px solid var(--c-border)',
                  }}>
                  {s < step ? <Check size={13} /> : s}
                </div>
                <span className="text-[13px] font-medium" style={{ color: s === step ? 'var(--c-text)' : 'var(--c-text3)' }}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-px mx-1" style={{ background: step > s ? '#2563EB' : 'var(--c-border)' }} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-[32px] font-bold tracking-tight mb-1.5" style={{ color: 'var(--c-text)' }}>
            {step === 1 ? 'Create your account' : 'Secure your account'}
          </h1>
          <p className="text-[15px] mb-8" style={{ color: 'var(--c-text2)' }}>
            {step === 1 ? 'Tell us who you are' : 'Choose a strong password'}
          </p>

          {regError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3.5 rounded-xl text-[14px]"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              {regError}
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={step}>
            {step === 1 ? (
              <motion.form key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onSubmit={handleStep1}
                className="space-y-5">
                <Field label="Full name" type="text" autoComplete="name" placeholder="Jane Doe"
                  error={form1.formState.errors.full_name?.message as string}
                  {...form1.register('full_name', { required: 'Name is required' })} />
                <Field label="Email address" type="email" autoComplete="email" placeholder="you@example.com"
                  error={form1.formState.errors.email?.message as string}
                  {...form1.register('email', { required: 'Email is required' })} />
                <button type="submit" className="btn-primary w-full mt-2">
                  Continue →
                </button>
              </motion.form>
            ) : (
              <motion.form key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onSubmit={handleStep2}
                className="space-y-5">
                <div>
                  <Field label="Password" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="At least 8 characters"
                    showToggle toggle={() => setShowPw(v => !v)}
                    error={form2.formState.errors.password?.message as string}
                    {...form2.register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} />
                  <StrengthBar pw={pw} />
                </div>
                <Field label="Confirm password" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Repeat password"
                  showToggle toggle={() => setShowConfirm(v => !v)}
                  error={form2.formState.errors.confirm?.message as string}
                  {...form2.register('confirm', { validate: v => v === pw || 'Passwords do not match' })} />
                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#2563EB] shrink-0" />
                  <span className="text-[14px] leading-relaxed" style={{ color: 'var(--c-text2)' }}>
                    I agree to the{' '}
                    <span className="font-semibold" style={{ color: '#2563EB' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span className="font-semibold" style={{ color: '#2563EB' }}>Privacy Policy</span>
                  </span>
                </label>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" disabled={registerPending} className="btn-primary flex-1">
                    {registerPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Creating…
                      </span>
                    ) : 'Create account'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-[14px] mt-8" style={{ color: 'var(--c-text3)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold hover:underline" style={{ color: '#2563EB' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
