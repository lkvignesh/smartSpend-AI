import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
interface ToastItem { id: string; type: ToastType; title: string; desc?: string }
interface ToastCtx {
  success: (t: string, d?: string) => void
  error:   (t: string, d?: string) => void
  warning: (t: string, d?: string) => void
  info:    (t: string, d?: string) => void
}

const ToastContext = createContext<ToastCtx | null>(null)

const CFG: Record<ToastType, { Icon: any; clr: string; bg: string; bdr: string }> = {
  success: { Icon: CheckCircle2,  clr: '#10B981', bg: 'rgba(16,185,129,0.1)',  bdr: 'rgba(16,185,129,0.25)' },
  error:   { Icon: XCircle,       clr: '#EF4444', bg: 'rgba(239,68,68,0.1)',   bdr: 'rgba(239,68,68,0.25)' },
  warning: { Icon: AlertTriangle, clr: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  bdr: 'rgba(245,158,11,0.25)' },
  info:    { Icon: Info,          clr: '#2563EB', bg: 'rgba(37,99,235,0.1)',   bdr: 'rgba(37,99,235,0.25)' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), [])

  const add = useCallback((type: ToastType, title: string, desc?: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(p => [...p.slice(-4), { id, type, title, desc }])
    setTimeout(() => remove(id), 4500)
  }, [remove])

  const ctx: ToastCtx = {
    success: (t, d) => add('success', t, d),
    error:   (t, d) => add('error', t, d),
    warning: (t, d) => add('warning', t, d),
    info:    (t, d) => add('info', t, d),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map(toast => {
            const { Icon, clr, bg, bdr } = CFG[toast.type]
            return (
              <motion.div key={toast.id}
                initial={{ opacity: 0, x: 72, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 72, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                role="alert"
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl pointer-events-auto"
                style={{ background: 'var(--c-surface)', border: `1px solid ${bdr}`, boxShadow: 'var(--c-shadowlg)', minWidth: 300, maxWidth: 380 }}
              >
                <div className="p-1 rounded-lg shrink-0" style={{ background: bg }}>
                  <Icon size={15} style={{ color: clr }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--c-text)' }}>{toast.title}</p>
                  {toast.desc && <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{toast.desc}</p>}
                </div>
                <button onClick={() => remove(toast.id)} aria-label="Dismiss"
                  className="p-1 rounded-lg shrink-0 transition-colors hover:bg-white/10"
                  style={{ color: 'var(--c-text3)' }}>
                  <X size={13} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be within ToastProvider')
  return ctx
}
