import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useExpenses, useCreateExpense, useDeleteExpense } from '@/hooks/useFinance'

const CATEGORIES = [
  { id: '1', name: 'Food',          color: '#FF5C7C' },
  { id: '2', name: 'Travel',        color: '#FFB547' },
  { id: '3', name: 'Shopping',      color: '#6C63FF' },
  { id: '4', name: 'Entertainment', color: '#00D4AA' },
  { id: '5', name: 'Healthcare',    color: '#4ECDC4' },
  { id: '6', name: 'Utilities',     color: '#95A5A6' },
  { id: '7', name: 'Education',     color: '#3498DB' },
  { id: '8', name: 'Other',         color: '#BDC3C7' },
]

const PAYMENT_METHODS = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']

const CARD_STYLE = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
const INPUT_CLS = 'w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#F0F0FF] placeholder-[#8A8AA0] focus:outline-none focus:border-[#6C63FF] transition-colors text-sm'
const LABEL_CLS = 'block text-xs font-medium text-[#8A8AA0] mb-1.5'

export default function Expenses() {
  const { data: expenses, isLoading } = useExpenses()
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const list = Array.isArray(expenses) ? expenses : []

  const onSubmit = (data: any) => {
    createExpense.mutate({
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date).toISOString(),
    }, {
      onSuccess: () => { setOpen(false); reset() },
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#F0F0FF]">Expenses</h1>
          <p className="text-[#8A8AA0] text-sm mt-1">Track every rupee you spend</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
        >
          <Plus size={16} />
          Add expense
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8A8AA0] mb-4">No expenses yet. Add your first one!</p>
            <button onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6C63FF]/40 text-[#6C63FF] text-sm hover:bg-[#6C63FF]/10 transition-colors">
              <Plus size={15} /> Add expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {list.map((e: any, idx: number) => {
              const cat = CATEGORIES.find(c => c.name === (e?.category?.name ?? ''))
              const color = cat?.color || '#6C63FF'
              return (
                <div key={String(e?.id ?? idx)}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: color + '22' }}>
                    💸
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F0F0FF]">{String(e?.title || '')}</p>
                    <p className="text-xs text-[#8A8AA0] mt-0.5">
                      {e?.date ? new Date(e.date).toLocaleDateString('en-IN') : ''}
                      {e?.merchant ? ' · ' + String(e.merchant) : ''}
                      {e?.payment_method ? ' · ' + String(e.payment_method) : ''}
                    </p>
                  </div>
                  {e?.category?.name ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: color + '22', color }}>
                      {String(e.category.name)}
                    </span>
                  ) : null}
                  <span className="font-bold text-[#FF5C7C] shrink-0 min-w-[80px] text-right">
                    ₹{(Number(e?.amount) || 0).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => deleteExpense.mutate(e.id)}
                    className="p-1.5 rounded-lg text-[#8A8AA0] hover:text-[#FF5C7C] hover:bg-[#FF5C7C]/10 transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={CARD_STYLE}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-[#F0F0FF]">Add expense</h2>
              <button onClick={() => setOpen(false)} className="text-[#8A8AA0] hover:text-[#F0F0FF]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className={LABEL_CLS}>Title</label>
                <input className={INPUT_CLS} placeholder="e.g. Lunch at Cafe"
                  {...register('title', { required: true })} />
                {errors.title ? <p className="mt-1 text-xs text-[#FF5C7C]">Required</p> : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>Amount (₹)</label>
                  <input type="number" step="0.01" className={INPUT_CLS} placeholder="0.00"
                    {...register('amount', { required: true, min: 0 })} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Date</label>
                  <input type="date" className={INPUT_CLS}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    {...register('date', { required: true })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>Payment method</label>
                  <select className={INPUT_CLS} defaultValue="UPI" {...register('payment_method')}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Merchant</label>
                  <input className={INPUT_CLS} placeholder="Optional" {...register('merchant')} />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Notes</label>
                <textarea rows={2} className={INPUT_CLS} placeholder="Optional"
                  {...register('notes')} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-[#8A8AA0] border border-white/[0.1] text-sm hover:bg-white/[0.04] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createExpense.isPending}
                  className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}>
                  {createExpense.isPending ? 'Saving…' : 'Save expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
