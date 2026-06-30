import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Search, Filter, X, ReceiptText } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useExpenses, useCreateExpense, useDeleteExpense } from '@/hooks/useFinance'
import { Input, Select } from '@/components/ui/Input'
import { Button }  from '@/components/ui/Button'
import { Badge }   from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { TransactionSkeleton } from '@/components/ui/Skeleton'
import { Dialog }  from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import { formatINR, formatDateShort, CATEGORY_COLORS, CATEGORY_EMOJIS } from '@/lib/utils'

const CATEGORIES = [
  'food', 'transport', 'entertainment', 'utilities',
  'shopping', 'health', 'education', 'travel', 'other',
]

type ExpenseForm = {
  description: string
  amount: number
  category: string
  date: string
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const color = CATEGORY_COLORS[label] ?? '#6366F1'
  const emoji = CATEGORY_EMOJIS[label] ?? '💳'
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap"
      style={{
        background: active ? `${color}20` : 'var(--card)',
        border: `1px solid ${active ? color : 'var(--border2)'}`,
        color: active ? color : 'var(--text2)',
      }}>
      <span>{emoji}</span>
      <span className="capitalize">{label}</span>
    </button>
  )
}

function ExpenseRow({ expense, onDelete, delay }: { expense: any; onDelete: (id: any) => void; delay: number }) {
  const cat   = (expense.category || 'other').toLowerCase()
  const emoji = CATEGORY_EMOJIS[cat] || '💳'
  const color = CATEGORY_COLORS[cat] || '#6366F1'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay, duration: 0.22 }}
      className="flex items-center gap-4 p-4 rounded-xl group transition-colors hover:bg-[var(--card2)]"
      style={{ border: '1px solid var(--border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text)' }}>
          {expense.description || expense.category || 'Expense'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="t-small capitalize" style={{ color: 'var(--text3)' }}>{cat}</span>
          <span className="t-small" style={{ color: 'var(--border3)' }}>·</span>
          <span className="t-small" style={{ color: 'var(--text3)' }}>
            {formatDateShort(expense.date || expense.created_at)}
          </span>
        </div>
      </div>
      <p className="text-[16px] font-bold num shrink-0" style={{ color: 'var(--danger)' }}>
        -{formatINR(expense.amount)}
      </p>
      <button
        onClick={() => onDelete(expense.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--danger-dim)]"
        style={{ color: 'var(--text3)' }}>
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

export default function Expenses() {
  const [open,        setOpen]        = useState(false)
  const [search,      setSearch]      = useState('')
  const [activecat,   setActiveCat]   = useState<string | null>(null)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const toast = useToast()

  const { data: expenses, isLoading } = useExpenses()
  const { mutate: create, isPending: creating } = useCreateExpense()
  const { mutate: remove } = useDeleteExpense()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseForm>({
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  })

  const list: any[] = Array.isArray(expenses) ? expenses : (expenses as any)?.expenses ?? []

  const filtered = useMemo(() => {
    let out = list
    if (activecat) out = out.filter(e => e.category?.toLowerCase() === activecat)
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(e =>
        e.description?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q)
      )
    }
    return out
  }, [list, activecat, search])

  const totalShown = filtered.reduce((s: number, e: any) => s + Number(e.amount), 0)

  const onSubmit = handleSubmit(data => {
    create({ ...data, amount: Number(data.amount) }, {
      onSuccess: () => {
        toast.success('Expense added')
        reset({ date: new Date().toISOString().slice(0, 10) })
        setOpen(false)
      },
      onError: () => toast.error('Failed to add expense'),
    })
  })

  const handleDelete = (id: any) => {
    remove(id, {
      onSuccess: () => toast.success('Expense removed'),
      onError:   () => toast.error('Failed to remove'),
    })
  }

  return (
    <>
      <div className="space-y-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Expenses</h1>
            <p className="t-body mt-1" style={{ color: 'var(--text2)' }}>
              Track and manage your spending
            </p>
          </div>
          <Button variant="primary" onClick={() => setOpen(true)} size="lg">
            <Plus size={16} /> Add Expense
          </Button>
        </div>

        {/* ── Stats row ── */}
        {!isLoading && list.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total',   value: formatINR(list.reduce((s: number, e: any) => s + Number(e.amount), 0)), color: 'var(--danger)' },
              { label: 'Average', value: formatINR(list.reduce((s: number, e: any) => s + Number(e.amount), 0) / list.length), color: 'var(--primary)' },
              { label: 'Count',   value: `${list.length} transactions`, color: 'var(--text)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="fp-card p-4">
                <p className="t-small mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
                <p className="text-[18px] font-bold num" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filters ── */}
        <div className="fp-card p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 px-3.5 rounded-xl"
              style={{
                height: 40,
                background: 'var(--card2)',
                border: `1px solid ${searchOpen ? 'var(--primary)' : 'var(--border2)'}`,
                boxShadow: searchOpen ? '0 0 0 3px var(--primary-dim)' : 'none',
              }}>
              <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                placeholder="Search expenses…"
                className="flex-1 bg-transparent text-[13px] focus:outline-none"
                style={{ color: 'var(--text)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ color: 'var(--text3)' }}>
                  <X size={13} />
                </button>
              )}
            </div>
            {/* Filter icon */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: activecat ? 'var(--primary-dim)' : 'var(--card2)',
                border: `1px solid ${activecat ? 'var(--primary)' : 'var(--border2)'}`,
                color: activecat ? 'var(--primary)' : 'var(--text3)',
              }}>
              <Filter size={15} />
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 fp-scroll">
            <CategoryChip label="all" active={activecat === null} onClick={() => setActiveCat(null)} />
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activecat === cat}
                onClick={() => setActiveCat(activecat === cat ? null : cat)}
              />
            ))}
          </div>
        </div>

        {/* ── Results header ── */}
        {(search || activecat) && (
          <div className="flex items-center justify-between">
            <p className="t-small" style={{ color: 'var(--text3)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} · {formatINR(totalShown)} total
            </p>
            <button onClick={() => { setSearch(''); setActiveCat(null) }}
              className="t-small font-medium hover:underline flex items-center gap-1"
              style={{ color: 'var(--primary)' }}>
              <X size={12} /> Clear filters
            </button>
          </div>
        )}

        {/* ── List ── */}
        {isLoading ? (
          <div className="space-y-3">
            {[0,1,2,3,4].map(i => <TransactionSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title={search || activecat ? 'No matching expenses' : 'No expenses yet'}
            description={search || activecat
              ? 'Try a different filter or search term'
              : 'Add your first expense to start tracking your spending'}
            action={{ label: 'Add Expense', onClick: () => setOpen(true) }}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2.5">
              {filtered.map((expense: any, i: number) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onDelete={handleDelete}
                  delay={Math.min(i * 0.04, 0.3)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Add Expense Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} title="Add Expense" size="md">
        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Description"
            placeholder="e.g. Lunch at café"
            error={errors.description?.message as string}
            {...register('description', { required: 'Description is required' })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="0.00"
              error={errors.amount?.message as string}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Must be > 0' },
              })}
            />
            <Input
              label="Date"
              type="date"
              error={errors.date?.message as string}
              {...register('date', { required: 'Date is required' })}
            />
          </div>
          <Select
            label="Category"
            error={errors.category?.message as string}
            {...register('category', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={creating}>Add Expense</Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
