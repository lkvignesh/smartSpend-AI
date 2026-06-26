import { useState } from 'react'
import { Plus, Target, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useGoals, useCreateGoal } from '@/hooks/useFinance'

const COLORS = ['#6C63FF', '#00D4AA', '#FFB547', '#FF5C7C', '#4ECDC4']
const CARD_STYLE = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
const INPUT_CLS = 'w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors text-sm'
const LABEL_CLS = 'block text-xs font-medium text-[#8A8AA0] mb-1.5'

export default function Goals() {
  const { data: goalsData, isLoading } = useGoals()
  const createGoal = useCreateGoal()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const goals = Array.isArray(goalsData) ? goalsData : []

  const onSubmit = (data: any) => {
    createGoal.mutate({
      ...data,
      target_amount: parseFloat(data.target_amount),
      current_amount: parseFloat(data.current_amount || '0'),
    }, { onSuccess: () => { setOpen(false); reset() } })
  }

  const pct = (current: number, target: number) =>
    target > 0 ? Math.min(100, (current / target) * 100) : 0

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#F0F0FF]">Goals</h1>
          <p className="text-[#8A8AA0] text-sm mt-1">Track your financial milestones</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
        >
          <Plus size={16} /> New goal
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-44 rounded-2xl bg-white/[0.04] animate-pulse" />)}
        </div>
      )}

      {!isLoading && goals.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={CARD_STYLE}>
          <Target size={48} className="mx-auto mb-4 text-[#8A8AA0]" />
          <p className="text-[#8A8AA0] mb-4">No goals yet. Set your first financial goal!</p>
          <button onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6C63FF]/40 text-[#6C63FF] text-sm hover:bg-[#6C63FF]/10 transition-colors">
            <Plus size={15} /> Create goal
          </button>
        </div>
      )}

      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g: any, i: number) => {
            const color = COLORS[i % COLORS.length]
            const progress = pct(Number(g?.current_amount) || 0, Number(g?.target_amount) || 1)
            const remaining = (Number(g?.target_amount) || 0) - (Number(g?.current_amount) || 0)
            return (
              <div key={String(g?.id ?? i)} className="rounded-2xl p-6" style={CARD_STYLE}>
                <div className="flex justify-between items-start mb-4">
                  <p className="font-semibold text-[#F0F0FF]">{String(g?.title || '')}</p>
                  <span className="text-sm font-medium" style={{ color }}>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: color }} />
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[11px] text-[#8A8AA0]">Saved</p>
                    <p className="text-[15px] font-semibold" style={{ color }}>
                      ₹{(Number(g?.current_amount) || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#8A8AA0]">Target</p>
                    <p className="text-[15px] font-semibold text-[#F0F0FF]">
                      ₹{(Number(g?.target_amount) || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {remaining > 0 && (
                  <p className="text-xs text-[#8A8AA0] mt-3">
                    ₹{remaining.toLocaleString('en-IN')} remaining
                    {g?.target_date ? ` · Due ${new Date(g.target_date).toLocaleDateString('en-IN')}` : ''}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={CARD_STYLE}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-[#F0F0FF]">Create goal</h2>
              <button onClick={() => setOpen(false)} className="text-[#8A8AA0] hover:text-[#F0F0FF]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className={LABEL_CLS}>Goal name</label>
                <input className={INPUT_CLS} placeholder="e.g. Emergency fund"
                  {...register('title', { required: true })} />
              </div>
              <div>
                <label className={LABEL_CLS}>Target amount (₹)</label>
                <input type="number" step="0.01" className={INPUT_CLS} placeholder="100000"
                  {...register('target_amount', { required: true })} />
              </div>
              <div>
                <label className={LABEL_CLS}>Amount saved so far (₹)</label>
                <input type="number" step="0.01" className={INPUT_CLS} placeholder="0" defaultValue="0"
                  {...register('current_amount')} />
              </div>
              <div>
                <label className={LABEL_CLS}>Target date (optional)</label>
                <input type="date" className={INPUT_CLS} {...register('target_date')} />
              </div>
              <div>
                <label className={LABEL_CLS}>Notes (optional)</label>
                <textarea rows={2} className={INPUT_CLS} placeholder="Add a note…" {...register('notes')} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-[#8A8AA0] border border-white/[0.1] text-sm hover:bg-white/[0.04] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createGoal.isPending}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}>
                  {createGoal.isPending ? 'Creating…' : 'Create goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
