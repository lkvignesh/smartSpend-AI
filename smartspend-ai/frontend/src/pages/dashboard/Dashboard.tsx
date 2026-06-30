import { useEffect, useRef, ElementType } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { TrendingUp, TrendingDown, PiggyBank, HeartPulse, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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

function container(stagger = 0.07) {
  return { hidden: {}, show: { transition: { staggerChildren: stagger } } }
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
}

function useCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const start = Date.now()
    const dur = 1100
    const tick = () => {
      const progress = Math.min((Date.now() - start) / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (ref.current) ref.current.textContent = Math.round(target * eased).toLocaleString('en-IN')
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return ref
}

function StatCard({ title, value, subtitle, trend, IconComp, gradient, trendUp }: {
  title: string; value: number; subtitle?: string; trend?: number
  IconComp: ElementType; gradient: string; trendUp?: boolean
}) {
  const numRef = useCounter(value)
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6 cursor-default"
      style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow)' }}>
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: gradient }}>
          <IconComp size={22} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-[13px] font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-[13px] font-medium mb-1.5" style={{ color: 'var(--c-text2)' }}>{title}</p>
      <p className="text-[30px] font-bold num leading-none" style={{ color: 'var(--c-text)' }}>
        ₹<span ref={numRef}>0</span>
      </p>
      {subtitle && <p className="text-[12px] mt-2" style={{ color: 'var(--c-text3)' }}>{subtitle}</p>}
    </motion.div>
  )
}

function HealthCard({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#2563EB' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow)' }}>
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <HeartPulse size={22} style={{ color }} />
        </div>
        <span className="text-[13px] font-bold num" style={{ color }}>{score}/100</span>
      </div>
      <p className="text-[13px] font-medium mb-1.5" style={{ color: 'var(--c-text2)' }}>Financial health</p>
      <div className="h-2 rounded-full mt-3" style={{ background: 'var(--c-border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }}
        />
      </div>
      <span className="inline-block mt-3 text-[12px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: `${color}15`, color }}>
        {label}
      </span>
    </motion.div>
  )
}

function AITip({ tip }: { tip: string }) {
  return (
    <motion.div variants={item}
      className="relative rounded-2xl p-px overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED, #06B6D4)' }}>
      <div className="rounded-[calc(1rem-1px)] px-5 py-4 flex items-center gap-4"
        style={{ background: 'var(--c-surface)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1"
            style={{ color: '#2563EB' }}>AI Insight</p>
          <p className="text-[14px] leading-snug" style={{ color: 'var(--c-text)' }}>{tip}</p>
        </div>
      </div>
    </motion.div>
  )
}

function TransactionRow({ e, last }: { e: any; last: boolean }) {
  const catName = String(e?.category?.name || 'Other')
  const icon = CAT_ICONS[catName] ?? '📦'
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(37,99,235,0.03)' }}
      className="flex items-center gap-4 px-6 transition-colors"
      style={{ minHeight: 64, borderBottom: last ? 'none' : '1px solid var(--c-border2)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: 'var(--c-s2)' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--c-text)' }}>
          {String(e?.title || '')}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--c-text3)' }}>
          {catName}
          {e?.date ? ` · ${new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : ''}
        </p>
      </div>
      <span className="text-[15px] font-bold num shrink-0" style={{ color: '#EF4444' }}>
        −₹{(Number(e?.amount) || 0).toLocaleString('en-IN')}
      </span>
    </motion.div>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-64 shimmer rounded-xl" />
        <div className="h-[64px] w-full shimmer rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-80 shimmer rounded-2xl" />
          <div className="h-80 shimmer rounded-2xl" />
        </div>
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

  const chartTextColor = 'var(--c-text2)'
  const gridColor = 'var(--c-border)'

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Spending',
        data: [expenses * 0.22, expenses * 0.28, expenses * 0.27, expenses * 0.23].map(n => Number(n.toFixed(0))),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.08)',
        fill: true, tension: 0.4, pointRadius: 5,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: 'var(--c-surface)',
        pointBorderWidth: 2,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => ` ₹${ctx.raw.toLocaleString('en-IN')}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartTextColor, font: { size: 12 } } },
      y: {
        grid: { color: gridColor },
        ticks: { color: chartTextColor, font: { size: 12 }, callback: (v: any) => `₹${(v/1000).toFixed(0)}k` },
      },
    },
  }

  const doughnutData = {
    labels: cats.map((c: any) => String(c?.name || '')),
    datasets: [{
      data: cats.map((c: any) => Number(c?.amount) || 0),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
      hoverOffset: 8,
    }],
  }

  const doughnutOptions = {
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: chartTextColor, padding: 14, font: { size: 12 }, boxWidth: 10, boxHeight: 10, borderRadius: 3, useBorderRadius: true },
      },
    },
  }

  return (
    <motion.div variants={container()} initial="hidden" animate="show" className="space-y-8">

      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-[40px] font-bold tracking-tight leading-none" style={{ color: 'var(--c-text)' }}>
          {greeting()} 👋
        </h1>
        <p className="text-[15px] mt-2" style={{ color: 'var(--c-text3)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      {/* AI tip */}
      <AITip tip={aiTip} />

      {/* Stats grid */}
      <motion.div variants={container(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Monthly spend" value={expenses} subtitle="This month" trend={-8} trendUp={false}
          gradient="linear-gradient(135deg, #EF4444, #DC2626)" IconComp={TrendingDown} />
        <StatCard title="Income" value={income} subtitle="This month" trend={5} trendUp={true}
          gradient="linear-gradient(135deg, #10B981, #059669)" IconComp={TrendingUp} />
        <StatCard title="Savings" value={savings} subtitle={`${savingsRate}% rate`}
          gradient="linear-gradient(135deg, #2563EB, #7C3AED)" IconComp={PiggyBank} />
        <HealthCard score={health} label={healthLabel} />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-semibold text-[15px]" style={{ color: 'var(--c-text)' }}>Spending trend</p>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--c-text3)' }}>This month by week</p>
            </div>
            <span className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
              Monthly
            </span>
          </div>
          <div style={{ minHeight: 240 }}>
            <Line data={lineData} options={lineOptions as any} />
          </div>
        </div>

        <div className="rounded-2xl p-6"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow)' }}>
          <p className="font-semibold text-[15px]" style={{ color: 'var(--c-text)' }}>Categories</p>
          <p className="text-[13px] mt-0.5 mb-6" style={{ color: 'var(--c-text3)' }}>Spend breakdown</p>
          {cats.length > 0
            ? <Doughnut data={doughnutData} options={doughnutOptions} />
            : <EmptyState compact title="No data yet" description="Expenses will appear here once you start tracking." />
          }
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div variants={item} className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: 'var(--c-shadow)' }}>
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--c-border)' }}>
          <p className="font-semibold text-[16px]" style={{ color: 'var(--c-text)' }}>Recent transactions</p>
          <span className="text-[13px] font-medium num" style={{ color: 'var(--c-text3)' }}>
            {recent.length} this month
          </span>
        </div>
        {isLoading ? (
          <div>
            {[1,2,3].map(i => <TransactionRowSkeleton key={i} />)}
          </div>
        ) : recent.length > 0
          ? recent.slice(0, 8).map((e: any, i: number) => (
              <TransactionRow key={String(e?.id ?? i)} e={e} last={i === Math.min(recent.length, 8) - 1} />
            ))
          : <EmptyState compact title="No transactions yet" description="Your recent expenses will show up here." />
        }
      </motion.div>
    </motion.div>
  )
}
