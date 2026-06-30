import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'surface' | 'glass' | 'gradient'
  padding?: boolean
  hover?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  as?: 'div' | 'section' | 'article'
}

export function Card({
  children, className, variant = 'default',
  padding = false, hover = false, onClick, style, as: As = 'div',
}: CardProps) {
  const varClass = {
    default:  'fp-card',
    surface:  'fp-card-surface',
    glass:    'fp-card-glass',
    gradient: 'fp-card',
  }[variant]

  const content = (
    <As
      className={cn(
        varClass,
        padding && 'p-6',
        hover && 'fp-card-hover',
        onClick && 'cursor-pointer',
        variant === 'gradient' && 'border-[rgba(59,130,246,0.15)]',
        className,
      )}
      style={{
        ...(variant === 'gradient' ? {
          background: 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(139,92,246,0.04) 100%)',
        } : {}),
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </As>
  )

  if (hover && onClick) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        {content}
      </motion.div>
    )
  }
  return content
}

export function CardHeader({ children, className, border = true }: {
  children: React.ReactNode; className?: string; border?: boolean
}) {
  return (
    <div className={cn(
      'flex items-center justify-between px-6 py-4',
      border && 'border-b border-[var(--border)]',
      className,
    )}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: {
  children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: {
  children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn(
      'px-6 py-4 border-t border-[var(--border)]',
      className,
    )}>
      {children}
    </div>
  )
}

/* Stat card — the KPI building block */
interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; label?: string }
  color?: string
  subtitle?: string
  className?: string
  loading?: boolean
  onClick?: () => void
}

export function StatCard({ label, value, icon, trend, color = '#3B82F6', subtitle, className, loading, onClick }: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('fp-card p-6', className)}>
        <div className="fp-shimmer h-4 w-24 rounded mb-4" />
        <div className="fp-shimmer h-8 w-32 rounded mb-3" />
        <div className="fp-shimmer h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn('fp-card p-6 cursor-default', onClick && 'cursor-pointer', className)}
      onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <p className="t-label" style={{ color: 'var(--text3)' }}>{label}</p>
        {icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}18` }}>
            {icon}
          </div>
        )}
      </div>
      <p className="t-card num font-bold mb-2" style={{ color: 'var(--text)' }}>
        {value}
      </p>
      <div className="flex items-center gap-2">
        {trend && (
          <span
            className="t-small font-semibold flex items-center gap-0.5"
            style={{ color: trend.value >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
        {subtitle && (
          <span className="t-small" style={{ color: 'var(--text3)' }}>{subtitle}</span>
        )}
      </div>
    </motion.div>
  )
}
