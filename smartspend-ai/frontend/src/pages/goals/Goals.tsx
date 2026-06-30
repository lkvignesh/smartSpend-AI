import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, X, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useGoals, useCreateGoal } from '@/hooks/useFinance'
import { GoalCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'

const EASE = [0.25, 0.1, 0.25, 1] as [number,number,number,number]

const GOAL_COLORS = [
  { from: '#2563EB', to: '#7C3AED', ring: '#2563EB' },
  { from: '#10B981', to: '#06B6D4', ring: '#10B981' },
  { from: '#F59E0B', to: '#EF4444', ring: '#F59E0B' },
  { from: '#7C3AED', to: '#EC4899', ring: '#7C3AED' },
  { from: '#06B6D4', to: '#2563EB', ring: '#06B6D4' },
]

const INPUT_CLS = 'w-full px-4 text-[15px] rounded-xl transition-colors focus:outline-none'

function CircularProgress({ pct, size = 96, color }: { pct: number; size?: number; color: string }) {
  const radius  = (size - 10) / 2
  const circ    = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, pct))

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth={6}
          stroke="var(--c-border)" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth={6}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - clamped / 100) }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </svg>
      <span className="absolute text-[13px] font-bold num" style={{ color }}>
        {Math.round(clamped)}%
      </span>
    </div>
  )
}

function GoalCard({ goal, colorIdx }: { goal: any; colorIdx: number }) {
  const c       = GOAL_COLORS[colorIdx % GOAL_COLORS.length]
  const current = Number(goal?.current_amount)  || 0
  const target  = Number(goal?.target_amount)   || 1
  const pct     = Math.min(100, (current / target) * 100)
  const done    = pct >= 100
  const deadline = goal?.deadline ? new Date(goal.deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86400000) : null
  const monthly  = (daysLeft && daysLeft > 0)
    ? ((target - current) / Math.ceil(daysLeft / 30))
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: 'var(--c-surface)',
        border: done ? `1px solid ${c.ring}40` : '1px solid var(--c-border)',
        boxShadow: done ? `0 0 0 1px ${c.ring}20, var(--c-shadow)` : 'var(--c-shadow)',
      }}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] truncate" style={{ color: 'var(--c-text)' }}>
            {String(goal?.name || 'Goal')}
          </p>
          {done && (
            <span className="inline-flex items-center gap-1 mt-2 text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${c.ring}15`, color: c.ring }}>
              <Sparkles size={11} /> Achieved!
            </span>
          )}
          {!done && daysLeft !== null && daysLeft >= 0 && (
            <p className="text-[13px] mt-1" style={{ color: 'var(--c-text3)' }}>
              {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
            </p>
          )}
          {!done && daysLeft !== null && daysLeft < 0 && (
            <p className="text-[13px] mt-1" style={{ color: '#EF4444' }}>
              Overdue by {Math.abs(daysLeft)} days
            </p>
          )}
        </div>
        <CircularProgress pct={pct} size={88} color={c.ring} />
      </div>

      {/* Amount progress */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[24px] font-bold num" style={{ color: 'var(--c-text)' }}>
            ₹{current.toLocaleString('en-IN')}
          </span>
          <span className="text-[13px] num" style={{ color: 'var(--c-text3)' }}>
            of ₹{target.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${c.from}, ${c.to})` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: EASE }}
          />
        </div>
      </div>

      {/* Monthly needed */}
      {monthly !== null && monthly > 0 && !done && (
        <p className="text-[13px]" style={{ color: 'var(--c-text3)' }}>
          Save{' '}
          <span className="font-semibold num" style={{ color: c.ring }}>
            ₹{Math.ceil(monthly).toLocaleString('en-IN')}/mo
          </span>{' '}
          to stay on track
        </p>
      )}
    </motion.div>
  )
}

function AddGoalDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createGoal = useCreateGoal()
  const toast = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    createGoal.mutate(
      { ...data, target_amount: parseFloat(data.target_amount), current_amount: parseFloat(data.current_amount || 0) },
      {
        onSuccess: () => { toast.success('Goal created', 'Keep saving to reach it!'); onClose(); reset() },
        onError:   () => toast.error('Failed to create goal'),
      }
    )
  }

  const inputStyle = { background: 'var(--c-s2)', color: 'var(--c-text)' }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />

          <motion.div
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{ width: 'min(440px, 100vw)', background: 'var(--c-surface)', borderLeft: '1px solid var(--c-border)', boxShadow: 'var(--c-shadowlg)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--c-border)' }}>
              <div>
                <h2 className="font-bold text-[18px] tracking-tight" style={{ color: 'var(--c-text)' }}>New goal</h2>
                <p className="text-[13px] mt-0.5" style={{ color: 'var(--c-text3)' }}>Set a target to work towards</p>
              </div>
              <button onClick={onClose} aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[rgba(239,68,68,0.08)]"
                style={{ color: 'var(--c-text3)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--c-text3)' }}>Goal name</label>
                <input className={`${INPUT_CLS} form-input`} style={inputStyle}
                  placeholder="e.g. Emergency fund"
                  {...register('name', { required: true })} />
                {errors.name && <p className="mt-1.5 text-[12px] text-red-500">Required</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                    style={{ color: 'var(--c-text3)' }}>Target (₹)</label>
                  <input type="number" step="1" className={`${INPUT_CLS} form-input`} style={inputStyle}
                    placeholder="50000"
                    {...register('target_amount', { required: true, min: 1 })} />
                  {errors.target_amount && <p className="mt-1.5 text-[12px] text-red-500">Required</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                    style={{ color: 'var(--c-text3)' }}>Saved so far (₹)</label>
                  <input type="number" step="1" className={`${INPUT_CLS} form-input`} style={inputStyle}
                    placeholder="0"
                    {...register('current_amount')} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--c-text3)' }}>Deadline (optional)</label>
                <input type="date" className={`${INPUT_CLS} form-input`} style={inputStyle}
                  {...register('deadline')} />
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--c-text3)' }}>Description (optional)</label>
                <textarea rows={3} className={`${INPUT_CLS} form-input`} style={{ ...inputStyle, resize: 'none' }}
                  placeholder="Why is this goal important to you?"
                  {...register('description')} />
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-5 shrink-0 flex gap-3" style={{ borderTop: '1px solid var(--c-border)' }}>
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleSubmit(onSubmit)} disabled={createGoal.isPending}
                className="btn-primary flex-1">
                {createGoal.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving…
                  </span>
                ) : 'Create goal'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Goals() {
  const { data: rawGoals, isLoading } = useGoals()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const goals  = Array.isArray(rawGoals) ? rawGoals : []
  const done   = goals.filter((g: any) => (Number(g?.current_amount) || 0) >= (Number(g?.target_amount) || 1))
  const active = goals.filter((g: any) => (Number(g?.current_amount) || 0) < (Number(g?.target_amount) || 1))

  const noGoalsPlaceholder = goals.length === 0 && !isLoading

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: 'var(--c-text)' }}>
            Goals
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--c-text3)' }}>
            {active.length} active · {done.length} achieved
          </p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="btn-primary shrink-0">
          <Plus size={16} />
          New goal
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <GoalCardSkeleton key={i} />)}
        </div>
      ) : noGoalsPlaceholder ? (
        <EmptyState
          title="No goals yet"
          description="Set a savings goal and track your progress toward it."
          action={{ label: 'Create first goal', onClick: () => setDrawerOpen(true) }}
        />
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--c-text3)' }}>
                In progress
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {active.map((g: any, i: number) => (
                  <GoalCard key={String(g?.id ?? i)} goal={g} colorIdx={i} />
                ))}
              </div>
            </div>
          )}
          {done.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--c-text3)' }}>
                Achieved
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {done.map((g: any, i: number) => (
                  <GoalCard key={String(g?.id ?? i)} goal={g} colorIdx={i + active.length} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AddGoalDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
