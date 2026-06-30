import { useEffect, useRef, ElementType } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  TrendingUp, TrendingDown, PiggyBank, HeartPulse, Sparkles,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { useDashboard } from '@/hooks/useFinance'
import { StatCardSkeleton, TransactionRowSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement)

const CHART_COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
const CAT_ICONS: Record<string, string> = {
  Food: '🍽', Travel: '✈', Shopping: '🛍', Entertainment: '🎬',
  Healthcare: '💊', Utilities: '⚡', Education: '📚', Other: '📦',
}
const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

function container(stagger = 0.06) {
  return { hidden: {}, show: { transition: { staggerChildren: stagger } } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
}

function useCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const start = Date.now()
    const dur = 1000
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      if (ref.current) ref.current.textContent = Math.round(target * e).toLocaleString('en-IN')
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return ref
}

/* ── Stat card ─────────────────────────────────── */
function StatCard({ label, value, subtitle, trend, trendUp, IconComp, accentColor }: {
  label: string; value: number; subtitle?: string; trend?: number; trendUp?: boolean
  IconComp: ElementType; accentColor: string
}) {
  const numRef = useCounter(value)
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }}
      className="relative rounded-2xl p-6 overflow-hidden cursor-default"
      style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>

      {/* Icon — subtle, top-right */}
      <div className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: `${accentColor}14` }}>
        <IconComp size={15} style={{ color: accentColor }} />
      </div>

      {/* Label eyebrow */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-3"
        style={{ color: 'var(--c-text3)' }}>
        {label}
      </p>

      {/* Value */}
      <p className="text-[26px] font-bold num leading-none" style={{ color: 'var(--c-text)' }}>
        ₹<span ref={numRef}>0</span>
      </p>

      {/* Footer row */}
      <div className="flex items-center gap-3 mt-3">
        {subtitle && (
          <span className="text-[12px]" style={{ color: 'var(--c-text3)' }}>{subtitle}</span>
        )}
        {trend !== undefined && (
          <span className={`ml-auto flex items-center gap-0.5 text-[12px] font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  )
}

/* ── Health card ───────────────────────────────── */
function HealthCard({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#2563EB' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>

      <div className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14` }}>
        <HeartPulse size={15} style={{ color }} />
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-3"
        style={{ color: 'var(--c-text3)' }}>
        Financial health
      </p>

      <p className="text-[26px] font-bold num leading-none" style={{ color: 'var(--c-text)' }}>
        {score}
        <span className="text-[16px] font-medium ml-0.5" style={{ color: 'var(--c-text3)' }}>/100</span>
      </p>

      <div className="mt-4 mb-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.1, ease: EASE }} />
      </div>

      <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
    </motion.div>
  )
}

/* ── AI insight banner ─────────────────────────── */
function InsightBanner({ tip }: { tip: string }) {
  return (
    <motion.div variants={fadeUp}
      className="flex items-start gap-4 rounded-2xl px-5 py-4"
      style={{
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderLeft: '3px solid #2563EB',
      }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'rgba(37,99,235,0.12)' }}>
        <Sparkles size={13} style={{ color: '#2563EB' }} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-1"
          style={{ color: '#2563EB' }}>
          AI Insight
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--c-text)' }}>
          {tip}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Transaction row ───────────────────────────── */
function TransactionRow({ e, last }: { e: any; last: boolean }) {
  const catName = String(e?.category?.name || 'Other')
  const icon = CAT_ICONS[catName] ?? '📦'
  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-colors"
      style={{ borderBottom: last ? 'none' : '1px solid var(--c-border2)' }}
      onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.background = 'var(--c-s2)')}
      onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.background = 'transparent')}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: 'var(--c-s2)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--c-text)' }}>
          {String(e?.title || '')}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--c-text3)' }}>
          {catName}
          {e?.date ? ` · ${new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : ''}
        </p>
      </div>
      <span className="text-[13px] font-semibold num shrink-0" style={{ color: '#EF4444' }}>
        −₹{(Number(e?.amount) || 0).toLocaleString('en-IN')}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-4"
      style={{ color: 'var(--c-text3)' }}>
      {children}
    </p>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

/* ── Page ──────────────────────────────────────── */
export default function Dashboard() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-1.5">
          <div className="h-8 w-56 shimmer rounded-lg" />
          <div className="h-4 w-40 shimmer rounded-lg" />
        </div>
        <div className="h-14 w-full shimmer rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-72 shimmer rounded-2xl" />
          <div className="h-72 shimmer rounded-2xl" />
        </div>
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    )
  }

  const expenses    = Number(data?.total_expenses_month) || 0
  const income      = Number(data?.total_income_month)   || 0
  const savings     = Number(data?.savings_month)        || 0
  const savingsRate = Number(data?.savings_rate)         || 0
  const health      = Number(data?.health_score)         || 0
  const healthLabel = String(data?.health_label         || 'Good')
  const cats        = Array.isArray(data?.top_categories)  ? data.top_categories  : []
  const recent      = Array.isArray(data?.recent_expenses) ? data.recent_expenses : []

  const aiTip = savings > 0
    ? `You've saved ₹${savings.toLocaleString('en-IN')} this month — a ${savingsRate}% savings rate. Keep it up!`
    : 'Start tracking expenses to get personalised AI recommendations.'

  const CT = 'var(--c-text2)'
  const GB = 'var(--c-border)'

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Spending',
      data: [expenses * 0.22, expenses * 0.28, expenses * 0.27, expenses * 0.23].map(n => Number(n.toFixed(0))),
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37,99,235,0.07)',
      fill: true, tension: 0.4, pointRadius: 4,
      pointBackgroundColor: '#2563EB',
      pointBorderColor: 'var(--c-surface)',
      pointBorderWidth: 2,
    }],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => ` ₹${ctx.raw.toLocaleString('en-IN')}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: CT, font: { size: 11 } } },
      y: { grid: { color: GB }, ticks: { color: CT, font: { size: 11 }, callback: (v: any) => `₹${(v/1000).toFixed(0)}k` } },
    },
  }

  const doughnutData = {
    labels: cats.map((c: any) => String(c?.name || '')),
    datasets: [{
      data: cats.map((c: any) => Number(c?.amount) || 0),
      backgroundColor: CHART_COLORS,
      borderWidth: 0, hoverOffset: 6,
    }],
  }

  const doughnutOptions = {
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: CT, padding: 12, font: { size: 11 }, boxWidth: 9, boxHeight: 9, borderRadius: 2, useBorderRadius: true },
      },
    },
  }

  return (
    <motion.div variants={container()} initial="hidden" animate="show" className="space-y-10">

      {/* ── Hero ───────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-[26px] font-bold tracking-tight leading-tight" style={{ color: 'var(--c-text)' }}>
          {greeting()} 👋
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--c-text3)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      {/* ── AI insight banner ──────────────────────── */}
      <InsightBanner tip={aiTip} />

      {/* ── KPI cards ──────────────────────────────── */}
      <motion.section variants={container(0.05)}>
        <SectionLabel>Overview</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Monthly spend"  value={expenses} subtitle="This month" trend={8}  trendUp={false} accentColor="#EF4444" IconComp={TrendingDown} />
          <StatCard label="Income"         value={income}   subtitle="This month" trend={5}  trendUp={true}  accentColor="#10B981" IconComp={TrendingUp} />
          <StatCard label="Net savings"    value={savings}  subtitle={`${savingsRate}% rate`}                accentColor="#2563EB" IconComp={PiggyBank} />
          <HealthCard score={health} label={healthLabel} />
        </div>
      </motion.section>

      {/* ── Charts ─────────────────────────────────── */}
      <motion.section variants={fadeUp}>
        <SectionLabel>Analytics</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Spending trend */}
          <div className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>Spending trend</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--c-text3)' }}>Weekly breakdown, this month</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
                Monthly
              </span>
            </div>
            <Line data={lineData} options={lineOptions as any} />
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl p-6"
            style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--c-text)' }}>Categories</p>
            <p className="text-[12px] mt-0.5 mb-5" style={{ color: 'var(--c-text3)' }}>Spending breakdown</p>
            {cats.length > 0
              ? <Doughnut data={doughnutData} options={doughnutOptions} />
              : <EmptyState compact title="No data yet" description="Categories appear once you log expenses." />
            }
          </div>
        </div>
      </motion.section>

      {/* ── Recent transactions ────────────────────── */}
      <motion.section variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Recent transactions</SectionLabel>
          <span className="text-[12px] num" style={{ color: 'var(--c-text3)' }}>
            {recent.length} this month
          </span>
        </div>
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
          {recent.length > 0
            ? recent.slice(0, 8).map((e: any, i: number) => (
                <TransactionRow key={String(e?.id ?? i)} e={e} last={i === Math.min(recent.length, 8) - 1} />
              ))
            : (
              <div>
                {[1,2,3].map(i => <TransactionRowSkeleton key={i} />)}
              </div>
            )
          }
          {recent.length === 0 && !isLoading && (
            <EmptyState compact title="No transactions yet" description="Your recent expenses will show up here." />
          )}
        </div>
      </motion.section>

    </motion.div>
  )
}
