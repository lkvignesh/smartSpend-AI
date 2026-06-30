import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, Target,
  Plus, ArrowRight, Sparkles, Brain,
  ReceiptText, ShoppingBag,
} from 'lucide-react'
import { useAuth }      from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useFinance'
import { StatCardSkeleton, ChartSkeleton, TransactionSkeleton } from '@/components/ui/Skeleton'
import { EmptyState }   from '@/components/ui/EmptyState'
import { Progress }     from '@/components/ui/Progress'
import { Badge }        from '@/components/ui/Badge'
import { HealthGauge }  from '@/components/ui/Progress'
import {
  formatINR, formatDateShort, getGreeting,
  CATEGORY_COLORS, CATEGORY_EMOJIS,
} from '@/lib/utils'

const CHART_STROKE = 'rgba(148,163,184,0.08)'
const TOOLTIP_STYLE: React.CSSProperties = {
  background: '#1E2740',
  border: '1px solid rgba(148,163,184,0.15)',
  borderRadius: 10,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  padding: '10px 14px',
  fontSize: 13,
  color: '#F1F5F9',
}

function AnimNum({ value }: { value: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      {value}
    </motion.span>
  )
}

interface KpiProps {
  label: string
  value: number
  icon: typeof TrendingUp
  color: string
  glow: string
  trend?: number
  delay: number
}
function KpiCard({ label, value, icon: Icon, color, glow, trend, delay }: KpiProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.4, 0, 0.2, 1] }}
      className="fp-card p-6 group">
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, boxShadow: `0 0 20px ${glow}` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
            style={{
              background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
            }}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="t-small mb-1.5" style={{ color: 'var(--text2)' }}>{label}</p>
      <p className="text-[28px] font-bold tracking-tight num" style={{ color: 'var(--text)' }}>
        <AnimNum value={typeof value === 'number' && !isNaN(value) ? formatINR(value) : String(value)} />
      </p>
    </motion.div>
  )
}

function TxRow({ tx, delay }: { tx: any; delay: number }) {
  const cat   = (tx.category || 'other').toLowerCase()
  const emoji = CATEGORY_EMOJIS[cat] || '💳'
  const color = CATEGORY_COLORS[cat] || '#6366F1'
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="flex items-center gap-4 py-3.5 border-b last:border-0 hover:bg-[var(--card2)] rounded-xl px-3 -mx-3 transition-colors"
      style={{ borderColor: 'var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
          {tx.description || tx.category || 'Expense'}
        </p>
        <p className="t-small mt-0.5 capitalize" style={{ color: 'var(--text3)' }}>
          {cat} · {formatDateShort(tx.date || tx.created_at)}
        </p>
      </div>
      <p className="text-[14px] font-bold num shrink-0" style={{ color: 'var(--danger)' }}>
        -{formatINR(tx.amount)}
      </p>
    </motion.div>
  )
}

function GoalWidget({ goal, delay }: { goal: any; delay: number }) {
  const pct = goal.target_amount > 0
    ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
    : 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28 }}
      className="p-4 rounded-xl"
      style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
          {goal.name}
        </p>
        <span className="t-small font-semibold num" style={{ color: 'var(--primary)' }}>{pct}%</span>
      </div>
      <Progress value={pct} size="sm" />
      <div className="flex justify-between mt-2">
        <span className="t-small num" style={{ color: 'var(--text3)' }}>{formatINR(goal.current_amount)}</span>
        <span className="t-small num" style={{ color: 'var(--text3)' }}>{formatINR(goal.target_amount)}</span>
      </div>
    </motion.div>
  )
}

function PieTip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={TOOLTIP_STYLE}>
      <p className="font-semibold capitalize">{name}</p>
      <p className="num mt-0.5" style={{ color: 'var(--primary)' }}>{formatINR(value)}</p>
    </div>
  )
}

function AreaTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={TOOLTIP_STYLE}>
      <p className="t-small mb-1.5" style={{ color: 'var(--text3)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="num text-[13px] font-semibold capitalize" style={{ color: p.color }}>
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user }            = useAuth()
  const { data, isLoading } = useDashboard()
  const navigate            = useNavigate()

  const totalExpenses  = data?.total_expenses    ?? data?.expenses_total    ?? 0
  const totalIncome    = data?.total_income      ?? data?.income_total      ?? 0
  const savings        = data?.savings           ?? (totalIncome - totalExpenses)
  const healthScore    = data?.health_score      ?? data?.financial_health  ?? 72
  const recentExpenses = data?.recent_expenses   ?? data?.expenses          ?? []
  const goals          = data?.goals             ?? []
  const monthlyData    = data?.monthly_expenses  ?? data?.monthly_data      ?? []
  const categories     = data?.category_breakdown ?? data?.categories        ?? []

  const chartData = useMemo(() => {
    if (monthlyData.length > 0) return monthlyData
    return ['Jan','Feb','Mar','Apr','May','Jun'].map((month, i) => ({
      month,
      expenses: Math.round(18000 + Math.sin(i * 0.8) * 4000 + i * 600),
      income:   Math.round(55000 + Math.cos(i * 0.5) * 3000),
    }))
  }, [monthlyData])

  const pieData = useMemo(() => {
    if (categories.length > 0) return categories
    return [
      { name: 'food',          value: 8400  },
      { name: 'transport',     value: 4200  },
      { name: 'entertainment', value: 3100  },
      { name: 'utilities',     value: 2800  },
      { name: 'shopping',      value: 5600  },
    ]
  }, [categories])

  const PIE_COLORS = pieData.map((d: any) =>
    CATEGORY_COLORS[((d.name || d.category || 'other') as string).toLowerCase()] ?? '#6366F1'
  )

  const kpis = [
    { label: 'Total Income',   value: totalIncome,   icon: TrendingUp,  color: '#10B981', glow: 'rgba(16,185,129,0.2)',  trend: 8 as number | undefined  },
    { label: 'Total Expenses', value: totalExpenses, icon: ReceiptText, color: '#EF4444', glow: 'rgba(239,68,68,0.2)',   trend: -3 as number | undefined },
    { label: 'Net Savings',    value: savings,       icon: Wallet,      color: '#3B82F6', glow: 'rgba(59,130,246,0.2)',  trend: 12 as number | undefined },
    { label: 'Active Goals',   value: goals.length,  icon: Target,      color: '#8B5CF6', glow: 'rgba(139,92,246,0.2)', trend: undefined                },
  ]

  const firstName = user?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8">

      {/* ── Hero ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="t-label mb-1" style={{ color: 'var(--primary)' }}>{getGreeting()}</p>
          <h1 className="text-[36px] font-bold tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
            {firstName},&nbsp;<span className="grad-text">here's your overview</span>
          </h1>
          <p className="t-body mt-2" style={{ color: 'var(--text2)' }}>Your financial snapshot for this month</p>
        </div>
        <button
          onClick={() => navigate('/expenses')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-[14px] font-semibold text-white shrink-0 transition-all hover:opacity-90 hover:-translate-y-px"
          style={{ background: 'var(--grad)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
          <Plus size={16} /> Add Expense
        </button>
      </motion.div>

      {/* ── Health + AI row ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="fp-card p-6 flex flex-col items-center">
          <p className="t-label mb-5" style={{ color: 'var(--text3)' }}>Financial Health</p>
          <HealthGauge score={isLoading ? 0 : healthScore} />
          <p className="t-small mt-4 text-center" style={{ color: 'var(--text3)' }}>
            {healthScore >= 80
              ? 'Excellent — keep it up!'
              : healthScore >= 60
              ? 'Good — room to improve'
              : 'Needs attention — review your spending'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.1 }}
          className="fp-card lg:col-span-2 p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--grad)' }}>
                <Brain size={17} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>AI Financial Insight</p>
                <p className="t-small" style={{ color: 'var(--text3)' }}>Powered by GPT-4</p>
              </div>
              <Badge variant="gradient" size="sm" className="ml-auto">Live</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[90, 75, 60].map(w => (
                  <div key={w} className="h-3.5 rounded fp-shimmer" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text)' }}>
                  {data?.ai_insight ??
                    `Your spending this month is ${totalExpenses > totalIncome * 0.7
                      ? 'higher than recommended'
                      : 'well within budget'}. ${savings > 0
                      ? `You've saved ${formatINR(savings)} — great work!`
                      : 'Consider reducing discretionary expenses to build savings.'}`}
                </p>
                <button
                  onClick={() => navigate('/ai')}
                  className="flex items-center gap-2 text-[13px] font-semibold transition-all hover:gap-3"
                  style={{ color: 'var(--primary)' }}>
                  <Sparkles size={14} /> Ask AI Advisor <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── KPIs ──────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          isLoading
            ? <StatCardSkeleton key={kpi.label} />
            : <KpiCard key={kpi.label} {...kpi} delay={0.1 + i * 0.07} />
        ))}
      </div>

      {/* ── Charts ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 fp-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>Cash Flow</p>
              <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>Income vs Expenses, 6 months</p>
            </div>
            <Badge variant="neutral" size="sm">Last 6 months</Badge>
          </div>
          {isLoading ? <ChartSkeleton /> : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="g-income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g-expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART_STROKE} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<AreaTip />} />
                  <Area type="monotone" dataKey="income"   name="Income"   stroke="#10B981" strokeWidth={2} fill="url(#g-income)"  dot={false} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fill="url(#g-expense)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4">
                {[{ color: '#10B981', label: 'Income' }, { color: '#EF4444', label: 'Expenses' }].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="t-small" style={{ color: 'var(--text3)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="fp-card p-6">
          <div className="mb-6">
            <p className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>By Category</p>
            <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>Spending breakdown</p>
          </div>
          {isLoading ? <ChartSkeleton /> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value" nameKey="name">
                    {pieData.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {pieData.slice(0, 4).map((d: any, i: number) => {
                  const name  = (d.name || d.category || 'other') as string
                  const total = pieData.reduce((s: number, x: any) => s + x.value, 0)
                  const pct   = total > 0 ? Math.round((d.value / total) * 100) : 0
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                        <span className="t-small capitalize" style={{ color: 'var(--text2)' }}>{name}</span>
                      </div>
                      <span className="t-small font-semibold num" style={{ color: 'var(--text)' }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Transactions + Goals ──────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 fp-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>Recent Transactions</p>
              <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>Latest activity</p>
            </div>
            <button onClick={() => navigate('/expenses')}
              className="flex items-center gap-1.5 text-[13px] font-medium hover:underline"
              style={{ color: 'var(--primary)' }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-3">{[0,1,2,3].map(i => <TransactionSkeleton key={i} />)}</div>
          ) : recentExpenses.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No transactions yet"
              description="Add your first expense to see it here"
              action={{ label: 'Add Expense', onClick: () => navigate('/expenses') }}
              compact />
          ) : (
            recentExpenses.slice(0, 5).map((tx: any, i: number) => (
              <TxRow key={tx.id ?? i} tx={tx} delay={0.05 + i * 0.06} />
            ))
          )}
        </div>

        <div className="fp-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>Goals</p>
              <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>Your progress</p>
            </div>
            <button onClick={() => navigate('/goals')}
              className="flex items-center gap-1.5 text-[13px] font-medium hover:underline"
              style={{ color: 'var(--primary)' }}>
              All <ArrowRight size={13} />
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[0,1,2].map(i => <div key={i} className="fp-shimmer h-20 rounded-xl" />)}
            </div>
          ) : goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals set"
              description="Create a savings goal to get started"
              action={{ label: 'Create Goal', onClick: () => navigate('/goals') }}
              compact />
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 4).map((g: any, i: number) => (
                <GoalWidget key={g.id ?? i} goal={g} delay={0.08 + i * 0.06} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
