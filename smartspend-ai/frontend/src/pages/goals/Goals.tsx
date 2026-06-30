import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Sparkles, Trophy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useGoals, useCreateGoal } from '@/hooks/useFinance'
import { Input }     from '@/components/ui/Input'
import { Button }    from '@/components/ui/Button'
import { Badge }     from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { GoalCardSkeleton } from '@/components/ui/Skeleton'
import { CircularProgress } from '@/components/ui/Progress'
import { Dialog }    from '@/components/ui/Dialog'
import { useToast }  from '@/components/ui/Toast'
import { formatINR } from '@/lib/utils'

type GoalForm = {
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
}

const GOAL_GRADIENTS = [
  'linear-gradient(135deg, #3B82F6, #8B5CF6)',
  'linear-gradient(135deg, #10B981, #06B6D4)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
]

function GoalCard({ goal, index, delay }: { goal: any; index: number; delay: number }) {
  const pct = goal.target_amount > 0
    ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
    : 0
  const remaining = Math.max(0, goal.target_amount - goal.current_amount)
  const done      = pct >= 100
  const gradient  = GOAL_GRADIENTS[index % GOAL_GRADIENTS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fp-card p-6 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">

      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: gradient }} />

      {/* Completion confetti shimmer */}
      {done && (
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444, #8B5CF6)' }} />
      )}

      <div className="flex items-start gap-5">
        {/* Circular progress */}
        <div className="shrink-0">
          <CircularProgress
            value={pct}
            size={80}
            strokeWidth={6}
            color={done ? '#10B981' : '#3B82F6'}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[16px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
              {goal.name}
            </p>
            {done
              ? <Badge variant="success" size="sm"><Trophy size={10} /> Done!</Badge>
              : <Badge variant="neutral" size="sm">{pct}%</Badge>
            }
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-[22px] font-bold num" style={{ color: done ? 'var(--success)' : 'var(--text)' }}>
              {formatINR(goal.current_amount)}
            </span>
            <span className="t-body" style={{ color: 'var(--text3)' }}>
              of {formatINR(goal.target_amount)}
            </span>
          </div>

          {/* Progress track */}
          <div className="h-2 rounded-full mb-3" style={{ background: 'var(--card2)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: done ? 'var(--success)' : gradient }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.34, 1.1, 0.64, 1] }}
            />
          </div>

          <div className="flex items-center justify-between">
            {done ? (
              <p className="t-small font-semibold" style={{ color: 'var(--success)' }}>
                Goal achieved!
              </p>
            ) : (
              <p className="t-small" style={{ color: 'var(--text3)' }}>
                {formatINR(remaining)} remaining
              </p>
            )}
            {goal.deadline && (
              <p className="t-small" style={{ color: 'var(--text3)' }}>
                Due {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Goals() {
  const [open, setOpen] = useState(false)
  const toast = useToast()

  const { data: goalsData, isLoading } = useGoals()
  const { mutate: create, isPending: creating } = useCreateGoal()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalForm>({
    defaultValues: { current_amount: 0 },
  })

  const goals: any[] = Array.isArray(goalsData) ? goalsData : (goalsData as any)?.goals ?? []
  const completed = goals.filter(g => g.current_amount >= g.target_amount).length

  const onSubmit = handleSubmit(data => {
    create({
      ...data,
      target_amount:  Number(data.target_amount),
      current_amount: Number(data.current_amount),
    }, {
      onSuccess: () => {
        toast.success('Goal created!')
        reset({ current_amount: 0 })
        setOpen(false)
      },
      onError: () => toast.error('Failed to create goal'),
    })
  })

  return (
    <>
      <div className="space-y-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Goals</h1>
            <p className="t-body mt-1" style={{ color: 'var(--text2)' }}>
              Track your savings milestones
            </p>
          </div>
          <Button variant="primary" onClick={() => setOpen(true)} size="lg">
            <Plus size={16} /> New Goal
          </Button>
        </div>

        {/* ── Summary ── */}
        {!isLoading && goals.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total goals',  value: goals.length,    color: 'var(--text)' },
              { label: 'Completed',    value: completed,       color: 'var(--success)' },
              { label: 'In progress',  value: goals.length - completed, color: 'var(--primary)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="fp-card p-4">
                <p className="t-small mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
                <p className="text-[22px] font-bold num" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── AI Suggestion banner ── */}
        {!isLoading && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4 p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
              border: '1px solid rgba(59,130,246,0.18)',
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--grad)' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                AI Recommendation
              </p>
              <p className="t-body" style={{ color: 'var(--text2)' }}>
                Based on your spending patterns, saving ₹5,000/month would help you hit your nearest goal ahead of schedule.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Goals grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[0,1,2,3].map(i => <GoalCardSkeleton key={i} />)}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Set your first savings goal and start building wealth. Your AI advisor will help you stay on track."
            action={{ label: 'Create Your First Goal', onClick: () => setOpen(true) }}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {goals.map((goal: any, i: number) => (
                <GoalCard key={goal.id ?? i} goal={goal} index={i} delay={i * 0.07} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Create Goal Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} title="Create New Goal" size="md">
        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Goal name"
            placeholder="e.g. Emergency Fund, New Laptop"
            error={errors.name?.message as string}
            {...register('name', { required: 'Name is required' })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target amount (₹)"
              type="number"
              placeholder="100000"
              error={errors.target_amount?.message as string}
              {...register('target_amount', {
                required: 'Target amount is required',
                min: { value: 1, message: 'Must be > 0' },
              })}
            />
            <Input
              label="Current savings (₹)"
              type="number"
              placeholder="0"
              error={errors.current_amount?.message as string}
              {...register('current_amount', {
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
            />
          </div>
          <Input
            label="Deadline (optional)"
            type="date"
            {...register('deadline')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={creating}>Create Goal</Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
