import { ElementType } from 'react'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { TrendingUp, TrendingDown, PiggyBank, Heart } from 'lucide-react'
import { useDashboard } from '@/hooks/useFinance'

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement)

const CHART_COLORS = ['#6C63FF', '#00D4AA', '#FFB547', '#FF5C7C', '#4ECDC4']
const CARD = 'rounded-2xl p-6' as const
const CARD_STYLE = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

function StatCard({ title, value, subtitle, color, IconComp }: {
  title: string; value: string; subtitle?: string; color: string; IconComp: ElementType
}) {
  return (
    <div className={CARD} style={CARD_STYLE}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[13px] text-[#8A8AA0] font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color }}>{value}</p>
          {subtitle ? <p className="text-xs text-[#8A8AA0] mt-1">{subtitle}</p> : null}
        </div>
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: color + '22' }}>
          <IconComp size={20} color={color} />
        </div>
      </div>
    </div>
  )
}

function HealthCard({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#00C896' : score >= 60 ? '#6C63FF' : score >= 40 ? '#FFB547' : '#FF5C7C'
  return (
    <div className={CARD} style={CARD_STYLE}>
      <div className="flex items-center gap-2 mb-3">
        <Heart size={16} color={color} />
        <p className="text-[13px] text-[#8A8AA0] font-medium">Financial health</p>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[#8A8AA0] text-sm">/100</span>
      </div>
      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: color + '22', color }}>
        {label}
      </span>
      <div className="mt-3 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-48 rounded-xl bg-white/[0.06] mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const expenses   = Number(data?.total_expenses_month) || 0
  const income     = Number(data?.total_income_month)   || 0
  const savings    = Number(data?.savings_month)        || 0
  const savingsRate = Number(data?.savings_rate)        || 0
  const healthScore = Number(data?.health_score)        || 0
  const healthLabel = String(data?.health_label        || 'N/A')
  const cats   = Array.isArray(data?.top_categories)   ? data.top_categories  : []
  const recent = Array.isArray(data?.recent_expenses)  ? data.recent_expenses : []
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

  const doughnutData = {
    labels: cats.map((c: any) => String(c?.name || '')),
    datasets: [{
      data: cats.map((c: any) => Number(c?.amount) || 0),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
    }],
  }

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Spending',
      data: [expenses * 0.2, expenses * 0.25, expenses * 0.3, expenses * 0.25].map(n => Number(n) || 0),
      borderColor: '#6C63FF',
      backgroundColor: 'rgba(108,99,255,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F0F0FF]">Dashboard</h1>
        <p className="text-[#8A8AA0] text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <StatCard title="Monthly expenses" value={fmt(expenses)} subtitle="This month" color="#FF5C7C" IconComp={TrendingDown} />
        <StatCard title="Monthly income"   value={fmt(income)}   subtitle="This month" color="#00D4AA" IconComp={TrendingUp} />
        <StatCard title="Savings"          value={fmt(savings)}  subtitle={savingsRate + '% savings rate'} color="#6C63FF" IconComp={PiggyBank} />
        <HealthCard score={healthScore} label={healthLabel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Line chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={CARD_STYLE}>
          <p className="font-semibold text-[#F0F0FF] mb-4">Spending trend</p>
          <Line data={lineData} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#8A8AA0' } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8A8AA0' } },
            },
          }} />
        </div>

        {/* Doughnut chart */}
        <div className="rounded-2xl p-6" style={CARD_STYLE}>
          <p className="font-semibold text-[#F0F0FF] mb-4">Top categories</p>
          {cats.length > 0 ? (
            <Doughnut data={doughnutData} options={{
              plugins: { legend: { position: 'bottom' as const, labels: { color: '#8A8AA0', padding: 12, font: { size: 12 } } } },
              cutout: '70%',
            }} />
          ) : (
            <div className="flex items-center justify-center py-10">
              <p className="text-[#8A8AA0] text-sm">No expenses this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl p-6" style={CARD_STYLE}>
        <p className="font-semibold text-[#F0F0FF] mb-4">Recent transactions</p>
        {recent.length > 0 ? (
          <div className="space-y-0 divide-y divide-white/[0.04]">
            {recent.map((e: any, i: number) => (
              <div key={String(e?.id ?? i)} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-medium text-[#F0F0FF]">{String(e?.title || '')}</p>
                  <p className="text-xs text-[#8A8AA0] mt-0.5">
                    {e?.date ? new Date(e.date).toLocaleDateString('en-IN') : ''}
                    {e?.merchant ? ' · ' + String(e.merchant) : ''}
                  </p>
                </div>
                <span className="font-bold text-[#FF5C7C]">
                  -{fmt(Number(e?.amount) || 0)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#8A8AA0] text-sm">No recent transactions. Add your first expense!</p>
        )}
      </div>
    </div>
  )
}
