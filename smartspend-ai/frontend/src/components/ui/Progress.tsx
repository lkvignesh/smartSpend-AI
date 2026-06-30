import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ── Linear progress bar ── */
interface ProgressProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  bg?: string
  animate?: boolean
  className?: string
  showLabel?: boolean
  gradient?: string
}

const sizeH = { xs: 'h-0.5', sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

export function Progress({
  value, max = 100, size = 'md', color = 'var(--primary)', bg = 'var(--card2)',
  animate = true, className, showLabel, gradient,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="t-small num" style={{ color: 'var(--text2)' }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', sizeH[size])}
        style={{ background: bg }}>
        <motion.div
          className={cn('h-full rounded-full')}
          style={{
            background: gradient || color,
            transformOrigin: 'left',
          }}
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </div>
    </div>
  )
}

/* ── Circular / radial progress ── */
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  bg?: string
  children?: React.ReactNode
  className?: string
}

export function CircularProgress({
  value, max = 100, size = 100, strokeWidth = 7, color = 'var(--primary)',
  bg = 'var(--card2)', children, className,
}: CircularProgressProps) {
  const pct    = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circ   = 2 * Math.PI * radius
  const offset = circ * (1 - pct / 100)

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth} stroke={bg}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth} stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Health gauge ── */
export function HealthGauge({ score, size = 120 }: { score: number; size?: number }) {
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#3B82F6' : score >= 45 ? '#F59E0B' : '#EF4444'
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 45 ? 'Fair' : 'Needs Work'

  return (
    <CircularProgress
      value={score}
      size={size}
      strokeWidth={8}
      color={color}
      bg="var(--card2)">
      <div className="text-center">
        <p className="font-bold num" style={{ fontSize: size * 0.22, color }}>
          {score}
        </p>
        <p className="t-small font-medium" style={{ color: 'var(--text3)' }}>{label}</p>
      </div>
    </CircularProgress>
  )
}
