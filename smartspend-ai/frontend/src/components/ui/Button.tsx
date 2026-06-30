import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size    = 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
}

const variantClass: Record<Variant, string> = {
  primary:   'fp-btn-primary',
  secondary: 'fp-btn-secondary',
  ghost:     'fp-btn-ghost',
  danger:    'fp-btn-danger',
  outline:   'fp-btn-ghost',
}

const sizeClass: Record<Size, string> = {
  sm:      'fp-btn-sm',
  md:      '',
  lg:      'fp-btn-lg',
  xl:      'fp-btn-xl',
  icon:    'fp-btn-icon',
  'icon-sm': 'fp-btn-icon fp-btn-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'secondary', size = 'md', loading, fullWidth, className, children, disabled, ...rest }, ref) {
    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.1 }}
        className={cn(
          'fp-btn',
          variantClass[variant],
          sizeClass[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || loading}
        {...(rest as any)}
      >
        {loading && <Loader2 size={15} className="animate-spin shrink-0" />}
        {children}
      </motion.button>
    )
  }
)
