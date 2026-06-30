import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useExpenses, useCreateExpense, useDeleteExpense } from '@/hooks/useFinance'
import { TransactionRowSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'

const CATS = [
  { name: 'Food',          color: '#EF4444', emoji: '🍽' },
  { name: 'Travel',        color: '#F59E0B', emoji: '✈' },
  { name: 'Shopping',      color: '#7C3AED', emoji: '🛍' },
  { name: 'Entertainment', color: '#06B6D4', emoji: '🎬' },
  { name: 'Healthcare',    color: '#10B981', emoji: '💊' },
  { name: 'Utilities',     color: '#6B7280', emoji: '⚡' },
  { name: 'Education',     color: '#2563EB', emoji: '📚' },
  { name: 'Other',         color: '#9CA3AF', emoji: '📦' },
]

const PMETHODS = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']

const INPUT_CLS = 'w-full px-4 text-[15px] rounded-xl transition-colors focus:outline-none'

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
        style={{ color: 'var(--c-text3)' }}>{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[12px]" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
}

function AddDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createExpense = useCreateExpense()
  const toast = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    createExpense.mutate(
      { ...data, amount: parseFloat(data.amount), date: new Date(data.date).toISOString() },
      {
        onSuccess: () => {
          toast.success('Expense added', 'Your expense has been recorded.')
          onClose(); reset()
        },
        onError: () => toast.error('Failed to add expense'),
      }
    )
  }

  const inputStyle = { background: 'var(--c-s2)', color: 'var(--c-text)' }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{ width: 'min(460px, 100vw)', background: 'var(--c-surface)', borderLeft: '1px solid var(--c-border)', boxShadow: 'var(--c-shadowlg)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--c-border)' }}>
              <div>
                <h2 className="font-bold text-[18px] tracking-tight" style={{ color: 'var(--c-text)' }}>Add expense</h2>
                <p className="text-[13px] mt-0.5" style={{ color: 'var(--c-text3)' }}>Record a new transaction</p>
              </div>
              <button onClick={onClose} aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                style={{ color: 'var(--c-text3)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <FormField label="Title" error={errors.title ? 'Required' : undefined}>
                <input className={`${INPUT_CLS} form-input`} style={inputStyle}
                  placeholder="e.g. Lunch at cafe"
                  {...register('title', { required: true })} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Amount (₹)" error={errors.amount ? 'Required' : undefined}>
                  <input type="number" step="0.01" className={`${INPUT_CLS} form-input`} style={inputStyle}
                    placeholder="0.00"
                    {...register('amount', { required: true, min: 0 })} />
                </FormField>
                <FormField label="Date">
                  <input type="date" className={`${INPUT_CLS} form-input`} style={inputStyle}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    {...register('date', { required: true })} />
                </FormField>
              </div>

              <FormField label="Payment method">
                <select className={`${INPUT_CLS} form-input`} style={inputStyle}
                  {...register('payment_method')}>
                  {PMETHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </FormField>

              <FormField label="Merchant (optional)">
                <input className={`${INPUT_CLS} form-input`} style={inputStyle}
                  placeholder="e.g. Swiggy"
                  {...register('merchant')} />
              </FormField>

              <FormField label="Notes (optional)">
                <textarea rows={3} className={`${INPUT_CLS} form-input`} style={{ ...inputStyle, resize: 'none' }}
                  placeholder="Any additional details…"
                  {...register('notes')} />
              </FormField>
            </form>

            {/* Footer */}
            <div className="px-6 py-5 shrink-0" style={{ borderTop: '1px solid var(--c-border)' }}>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="btn-ghost flex-none">
                  Cancel
                </button>
                <button onClick={handleSubmit(onSubmit)} disabled={createExpense.isPending}
                  className="btn-primary flex-1">
                  {createExpense.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Saving…
                    </span>
                  ) : 'Save expense'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Expenses() {
  const { data: rawExpenses, isLoading } = useExpenses()
  const deleteExpense = useDeleteExpense()
  const toast = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<string | null>(null)

  const list = Array.isArray(rawExpenses) ? rawExpenses : []

  const filtered = list.filter((e: any) => {
    const matchesSearch = !search ||
      String(e?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      String(e?.merchant || '').toLowerCase().includes(search.toLowerCase())
    const matchesCat = !catFilter || (e?.category?.name === catFilter)
    return matchesSearch && matchesCat
  })

  const handleDelete = (id: any) => {
    deleteExpense.mutate(id, {
      onSuccess: () => toast.success('Expense deleted'),
      onError: () => toast.error('Failed to delete'),
    })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: 'var(--c-text)' }}>
            Expenses
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--c-text3)' }}>
            {list.length} transactions this month
          </p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="btn-primary shrink-0">
          <Plus size={16} />
          Add expense
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 rounded-xl"
          style={{ height: 48, background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
          <Search size={16} style={{ color: 'var(--c-text3)' }} />
          <input
            className="flex-1 text-[14px] bg-transparent focus:outline-none"
            style={{ color: 'var(--c-text)' }}
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'var(--c-text3)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCatFilter(null)}
            className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors"
            style={{
              background: !catFilter ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'var(--c-s2)',
              color: !catFilter ? 'white' : 'var(--c-text2)',
              border: catFilter ? '1px solid var(--c-border)' : 'none',
            }}>
            All
          </button>
          {CATS.map(c => (
            <button key={c.name}
              onClick={() => setCatFilter(catFilter === c.name ? null : c.name)}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors"
              style={{
                background: catFilter === c.name ? c.color : 'var(--c-s2)',
                color: catFilter === c.name ? 'white' : 'var(--c-text2)',
                border: catFilter !== c.name ? '1px solid var(--c-border)' : 'none',
              }}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Expense list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
        {isLoading ? (
          <div className="divide-y" style={{ borderColor: 'var(--c-border2)' }}>
            {[1,2,3,4,5].map(i => <TransactionRowSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search || catFilter ? 'No matching expenses' : 'No expenses yet'}
            description={search || catFilter ? 'Try adjusting your filters.' : 'Add your first expense to start tracking.'}
            action={!search && !catFilter ? { label: 'Add expense', onClick: () => setDrawerOpen(true) } : undefined}
          />
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--c-border2)' }}>
            <AnimatePresence initial={false}>
              {filtered.map((e: any, idx: number) => {
                const cat = CATS.find(c => c.name === (e?.category?.name ?? ''))
                return (
                  <motion.div
                    key={String(e?.id ?? idx)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4 px-6 group"
                    style={{ minHeight: 64, background: 'transparent' }}
                    onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.background = 'var(--c-s2)')}
                    onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    {/* Category icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: cat ? `${cat.color}15` : 'var(--c-s2)' }}>
                      {cat?.emoji ?? '📦'}
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0 py-4">
                      <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--c-text)' }}>
                        {String(e?.title || '')}
                      </p>
                      <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--c-text3)' }}>
                        {e?.date ? new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                        {e?.merchant ? ` · ${String(e.merchant)}` : ''}
                        {e?.payment_method ? ` · ${String(e.payment_method)}` : ''}
                      </p>
                    </div>

                    {/* Category pill */}
                    {e?.category?.name && (
                      <span className="text-[12px] font-medium px-3 py-1 rounded-full shrink-0 hidden sm:inline"
                        style={{ background: cat ? `${cat.color}15` : 'var(--c-s2)', color: cat?.color ?? 'var(--c-text2)' }}>
                        {String(e.category.name)}
                      </span>
                    )}

                    {/* Amount */}
                    <span className="text-[15px] font-bold num shrink-0" style={{ color: '#EF4444' }}>
                      ₹{(Number(e?.amount) || 0).toLocaleString('en-IN')}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(e.id)}
                      aria-label="Delete expense"
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AddDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
