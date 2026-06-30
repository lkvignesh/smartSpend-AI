import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { useDashboard } from '@/hooks/useFinance'
import { Badge }  from '@/components/ui/Badge'
import { ChartSkeleton } from '@/components/ui/Skeleton'
import { formatINR, CATEGORY_COLORS } from '@/lib/utils'

const TOOLTIP_STYLE: React.CSSProperties = {
  background: '#1E2740',
  border: '1px solid rgba(148,163,184,0.15)',
  borderRadius: 10,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  padding: '10px 14px',
  fontSize: 13,
  color: '#F1F5F9',
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={TOOLTIP_STYLE}>
      {label && <p className="t-small mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} className="font-semibold" style={{ color: p.color || '#F1F5F9' }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatINR(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

function SectionCard({ title, subtitle, children, badge }: {
  title: string; subtitle?: string; children: React.ReactNode; badge?: string
}) {
  return (
    <div className="fp-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>{title}</p>
          {subtitle && <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>{subtitle}</p>}
        </div>
        {badge && <Badge variant="neutral" size="sm">{badge}</Badge>}
      </div>
      {children}
    </div>
  )
}

export default function Analytics() {
  const { data, isLoading } = useDashboard()

  const monthlyData = useMemo(() => {
    if (data?.monthly_data?.length) return data.monthly_data
    return [
      { month: 'Jan', expenses: 22000, income: 55000, savings: 33000 },
      { month: 'Feb', expenses: 18500, income: 55000, savings: 36500 },
      { month: 'Mar', expenses: 25000, income: 58000, savings: 33000 },
      { month: 'Apr', expenses: 19800, income: 58000, savings: 38200 },
      { month: 'May', expenses: 21000, income: 62000, savings: 41000 },
      { month: 'Jun', expenses: 17500, income: 62000, savings: 44500 },
    ]
  }, [data])

  const categories = useMemo(() => {
    if (data?.category_breakdown?.length) return data.category_breakdown
    return [
      { name: 'food',          value: 8400,  change: -5  },
      { name: 'transport',     value: 4200,  change: 2   },
      { name: 'entertainment', value: 3100,  change: -12 },
      { name: 'utilities',     value: 2800,  change: 0   },
      { name: 'shopping',      value: 5600,  change: 8   },
      { name: 'health',        value: 1800,  change: -3  },
    ]
  }, [data])

  const weeklyTrend = useMemo(() => {
    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => ({
      day,
      amount: Math.round(800 + Math.sin(i * 0.9) * 400 + i * 60),
    }))
  }, [])

  const totalIncome   = data?.total_income   ?? 62000
  const totalExpenses = data?.total_expenses ?? 17500
  const savingsRate   = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0

  const KPI_DATA = [
    { label: 'Savings Rate', value: `${savingsRate}%`, trend: 4, color: 'var(--success)' },
    { label: 'Avg Daily Spend', value: formatINR(totalExpenses / 30), trend: -8, color: 'var(--primary)' },
    { label: 'Top Category', value: categories[0]?.name ?? 'Food', trend: undefined, color: 'var(--text)' },
    { label: 'Budget Used', value: `${Math.round((totalExpenses / totalIncome) * 100)}%`, trend: 2, color: 'var(--warning)' },
  ]

  const PIE_COLORS = categories.map((d: any) =>
    CATEGORY_COLORS[(d.name || d.category || 'other').toLowerCase()] ?? '#6366F1'
  )

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--grad)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
          <BarChart3 size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Analytics</h1>
          <p className="t-body" style={{ color: 'var(--text2)' }}>Detailed financial insights</p>
        </div>
      </motion.div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_DATA.map(({ label, value, trend, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="fp-card p-5">
            <p className="t-small mb-1.5" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[24px] font-bold num" style={{ color }}>{value}</p>
            {trend !== undefined && (
              <p className="t-small mt-1.5 flex items-center gap-1 font-medium"
                style={{ color: trend >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {Math.abs(trend)}% vs last month
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Cash flow + category row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <SectionCard
          title="Income vs Expenses"
          subtitle="6-month comparison"
          badge="Monthly"
          children={isLoading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ left: -10, right: 4 }} barGap={4}>
                <CartesianGrid stroke="rgba(148,163,184,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="income"   name="Income"   fill="#10B981" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        />

        <SectionCard
          title="Category Breakdown"
          subtitle="Where your money goes"
          children={isLoading ? <ChartSkeleton /> : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" innerRadius={52} outerRadius={76}
                    paddingAngle={3} dataKey="value" nameKey="name">
                    {categories.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-2">
                {categories.slice(0, 5).map((c: any, i: number) => {
                  const total = categories.reduce((s: number, x: any) => s + x.value, 0)
                  const pct   = total > 0 ? Math.round((c.value / total) * 100) : 0
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="t-small capitalize flex-1" style={{ color: 'var(--text2)' }}>
                        {c.name || c.category}
                      </span>
                      <span className="t-small font-semibold num" style={{ color: 'var(--text)' }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        />
      </div>

      {/* ── Savings trend + weekly pattern ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Savings Trend"
          subtitle="Monthly savings over time"
          children={isLoading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ left: -10, right: 4 }}>
                <defs>
                  <linearGradient id="g-savings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="savings" name="Savings"
                  stroke="#3B82F6" strokeWidth={2.5} fill="url(#g-savings)" dot={{ fill: '#3B82F6', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        />

        <SectionCard
          title="Weekly Spending Pattern"
          subtitle="Average spend per day of week"
          children={isLoading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTrend} margin={{ left: -10, right: 4 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.07)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'var(--text3)' as string, fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v: number) => `₹${v}`} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="amount" name="Spent" radius={[5,5,0,0]}>
                  {weeklyTrend.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={i >= 5 ? '#EF4444' : '#3B82F6'}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        />
      </div>

      {/* ── Category table ── */}
      <SectionCard title="Category Details" subtitle="Month-over-month change">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Category', 'Spent', 'Budget', 'vs Last Month'].map(h => (
                  <th key={h} className="text-left pb-3 t-label" style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {categories.map((c: any, i: number) => {
                const change  = c.change ?? 0
                const budget  = c.value * 1.15
                const usedPct = Math.round((c.value / budget) * 100)
                return (
                  <tr key={i} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-[13px] font-medium capitalize" style={{ color: 'var(--text)' }}>
                          {c.name || c.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-[13px] font-semibold num" style={{ color: 'var(--text)' }}>
                        {formatINR(c.value)}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 rounded-full" style={{ background: 'var(--card2)' }}>
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min(usedPct, 100)}%`,
                            background: usedPct > 90 ? 'var(--danger)' : PIE_COLORS[i],
                          }} />
                        </div>
                        <span className="t-small num" style={{ color: 'var(--text3)' }}>{usedPct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1 t-small font-semibold"
                        style={{ color: change > 0 ? 'var(--danger)' : change < 0 ? 'var(--success)' : 'var(--text3)' }}>
                        {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : null}
                        {change !== 0 ? `${Math.abs(change)}%` : 'Same'}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
