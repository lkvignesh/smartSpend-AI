import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  emoji?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  compact?: boolean
  className?: string
}

export function EmptyState({
  icon: Icon, emoji, title, description, action, secondaryAction, compact, className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-10 px-6' : 'py-20 px-8',
        className,
      )}>
      {(Icon || emoji) && (
        <div className={cn(
          'flex items-center justify-center rounded-2xl mb-5',
          compact ? 'w-14 h-14' : 'w-20 h-20',
        )}
        style={{ background: 'var(--card2)', border: '1px solid var(--border2)' }}>
          {emoji && <span className={compact ? 'text-2xl' : 'text-3xl'}>{emoji}</span>}
          {Icon && <Icon size={compact ? 22 : 30} style={{ color: 'var(--text3)' }} />}
        </div>
      )}
      <h3 className={cn('font-semibold mb-2', compact ? 't-body' : 't-card')}
        style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      {description && (
        <p className={cn('max-w-xs leading-relaxed', compact ? 't-small mb-4' : 't-body mb-6')}
          style={{ color: 'var(--text2)' }}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button variant={action.variant || 'primary'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
