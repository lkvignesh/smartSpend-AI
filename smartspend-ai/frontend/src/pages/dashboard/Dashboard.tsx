import {
  Box, Card, CardContent, Grid, Typography,
  LinearProgress, Chip, Skeleton, Avatar
} from '@mui/material'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  BarElement,
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { useDashboard } from '@/hooks/useFinance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SavingsIcon from '@mui/icons-material/Savings'
import FavoriteIcon from '@mui/icons-material/Favorite'

ChartJS.register(
  ArcElement, Tooltip, Legend,
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Filler, BarElement
)

function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography fontSize={13} color="text.secondary" fontWeight={500}>{title}</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color }}>{value}</Typography>
            {subtitle && (
              <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}22`, color, width: 44, height: 44 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

function HealthScoreCard({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#00C896' : score >= 60 ? '#6C63FF' : score >= 40 ? '#FFB547' : '#FF5C7C'
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FavoriteIcon sx={{ color }} fontSize="small" />
          <Typography fontSize={13} color="text.secondary" fontWeight={500}>Financial health</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color }}>{score}</Typography>
          <Typography color="text.secondary" fontSize={14}>/100</Typography>
        </Box>
        <Chip
          label={label}
          size="small"
          sx={{ mt: 1, bgcolor: `${color}22`, color, fontWeight: 600, fontSize: 11 }}
        />
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            mt: 2, height: 6, borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard()

  const fmt = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`

  const expenses = Number(data?.total_expenses_month) || 0
  const income = Number(data?.total_income_month) || 0
  const savings = Number(data?.savings_month) || 0
  const savingsRate = Number(data?.savings_rate) || 0
  const healthScore = Number(data?.health_score) || 0
  const healthLabel = String(data?.health_label || 'N/A')
  const cats = Array.isArray(data?.top_categories) ? data.top_categories : []
  const recentExpenses = Array.isArray(data?.recent_expenses) ? data.recent_expenses : []

  const chartColors = ['#6C63FF', '#00D4AA', '#FFB547', '#FF5C7C', '#4ECDC4']

  const doughnutData = {
    labels: cats.map((c: any) => String(c?.name || '')),
    datasets: [{
      data: cats.map((c: any) => Number(c?.amount) || 0),
      backgroundColor: chartColors,
      borderWidth: 0,
    }],
  }

  const spendingTrend = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Spending',
      data: [
        expenses * 0.2,
        expenses * 0.25,
        expenses * 0.3,
        expenses * 0.25,
      ],
      borderColor: '#6C63FF',
      backgroundColor: 'rgba(108,99,255,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  }

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Monthly expenses"
            value={fmt(expenses)}
            subtitle="This month"
            icon={<TrendingDownIcon />}
            color="#FF5C7C"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Monthly income"
            value={fmt(income)}
            subtitle="This month"
            icon={<TrendingUpIcon />}
            color="#00D4AA"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Savings"
            value={fmt(savings)}
            subtitle={`${savingsRate}% savings rate`}
            icon={<SavingsIcon />}
            color="#6C63FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <HealthScoreCard score={healthScore} label={healthLabel} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 2 }}>Spending trend</Typography>
              <Line
                data={spendingTrend}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#8A8AA0' } },
                    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8A8AA0' } }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 2 }}>Top categories</Typography>
              {cats.length > 0 ? (
                <Doughnut
                  data={doughnutData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#8A8AA0', padding: 12, font: { size: 12 } }
                      }
                    },
                    cutout: '70%'
                  }}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary" fontSize={14}>
                    No expenses this month
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 2 }}>Recent transactions</Typography>
              {recentExpenses.length > 0 ? recentExpenses.map((e: any) => (
                <Box
                  key={e?.id}
                  sx={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', py: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <Box>
                    <Typography fontSize={14} fontWeight={500}>{String(e?.title || '')}</Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {e?.date ? new Date(e.date).toLocaleDateString('en-IN') : ''}
                      {e?.merchant ? ` · ${e.merchant}` : ''}
                    </Typography>
                  </Box>
                  <Typography fontWeight={600} sx={{ color: '#FF5C7C' }}>
                    -₹{(Number(e?.amount) || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              )) : (
                <Typography color="text.secondary" fontSize={14}>
                  No recent transactions. Add your first expense!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
