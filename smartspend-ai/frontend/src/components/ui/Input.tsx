import { forwardRef, useState } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, hint, error, icon: Icon, iconRight: IconRight, size = 'md', className, type, ...rest }, ref) {
    const [showPw, setShowPw] = useState(false)
    const isPw = type === 'password'
    const resolvedType = isPw ? (showPw ? 'text' : 'password') : type

    const sizeH: Record<string, string> = {
      sm: 'h-[var(--input-h-sm)]',
      md: 'h-[var(--input-h)]',
      lg: 'h-[var(--input-h-lg)]',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block t-label mb-2" style={{ color: 'var(--text2)' }}>
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10"
              style={{ color: 'var(--text3)' }}>
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            type={resolvedType}
            className={cn(
              'fp-input',
              sizeH[size],
              error && 'fp-input-error',
              Icon && 'pl-11',
              (IconRight || isPw) && 'pr-11',
              className,
            )}
            {...rest}
          />
          {isPw && (
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text3)' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {IconRight && !isPw && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text3)' }}>
              <IconRight size={16} />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 t-small" style={{ color: 'var(--danger)' }}>{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 t-small" style={{ color: 'var(--text3)' }}>{hint}</p>
        )}
      </div>
    )
  }
)

/* Thin wrapper for select elements */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, hint, className, children, ...rest }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block t-label mb-2" style={{ color: 'var(--text2)' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn('fp-input', error && 'fp-input-error', className)}
          {...rest}>
          {children}
        </select>
        {error && <p className="mt-1.5 t-small" style={{ color: 'var(--danger)' }}>{error}</p>}
        {hint && !error && <p className="mt-1.5 t-small" style={{ color: 'var(--text3)' }}>{hint}</p>}
      </div>
    )
  }
)

/* Textarea */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, ...rest }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block t-label mb-2" style={{ color: 'var(--text2)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn('fp-input', error && 'fp-input-error', className)}
          {...rest}
        />
        {error && <p className="mt-1.5 t-small" style={{ color: 'var(--danger)' }}>{error}</p>}
        {hint && !error && <p className="mt-1.5 t-small" style={{ color: 'var(--text3)' }}>{hint}</p>}
      </div>
    )
  }
)
