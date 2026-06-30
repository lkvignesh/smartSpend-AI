import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  width?: number | string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, subtitle, width = 480, children, footer, className }: DrawerProps) {
  /* Trap focus / close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 'var(--z-drawer)' } as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn('fixed right-0 top-0 h-full flex flex-col', className)}
            style={{
              width: typeof width === 'number' ? `min(${width}px, 100vw)` : width,
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border2)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 'calc(var(--z-drawer) + 1)',
            } as any}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="t-card font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
                {subtitle && (
                  <p className="t-caption mt-0.5" style={{ color: 'var(--text2)' }}>{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--card)] hover:text-[var(--danger)]"
                style={{ color: 'var(--text3)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto fp-scroll p-6 space-y-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-5 shrink-0 flex gap-3"
                style={{ borderTop: '1px solid var(--border)' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
