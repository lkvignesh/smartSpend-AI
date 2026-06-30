import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'gradient'
type BadgeSize    = 'sm' | 'md' | 'lg'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: LucideIcon
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantClass: Record<BadgeVariant, string> = {
  primary:  'fp-badge-primary',
  success:  'fp-badge-success',
  danger:   'fp-badge-danger',
  warning:  'fp-badge-warning',
  info:     'fp-badge-info',
  neutral:  'fp-badge-neutral',
  gradient: 'fp-badge-primary',  // styled below
}

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: '',
  lg: 'px-3 py-1 text-[12px]',
}

export function Badge({ variant = 'neutral', size = 'md', icon: Icon, dot, children, className }: BadgeProps) {
  return (
    <span className={cn(
      'fp-badge',
      variantClass[variant],
      sizeClass[size],
      variant === 'gradient' && 'text-white border-transparent',
      className,
    )}
    style={variant === 'gradient' ? { background: 'var(--grad)' } : undefined}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{
          background: {
            primary: 'var(--primary)',
            success: 'var(--success)',
            danger:  'var(--danger)',
            warning: 'var(--warning)',
            info:    'var(--info)',
            neutral: 'var(--text3)',
            gradient:'var(--primary)',
          }[variant],
        }} />
      )}
      {Icon && <Icon size={10} />}
      {children}
    </span>
  )
}

/* Trend badge specifically for financial numbers */
export function TrendBadge({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isPositive = value >= 0
  return (
    <span className="fp-badge t-small font-semibold inline-flex items-center gap-0.5"
      style={{
        background: isPositive ? 'var(--success-dim)' : 'var(--danger-dim)',
        color: isPositive ? 'var(--success)' : 'var(--danger)',
        border: `1px solid ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
      }}>
      {isPositive ? '↑' : '↓'} {Math.abs(value)}{suffix}
    </span>
  )
}
