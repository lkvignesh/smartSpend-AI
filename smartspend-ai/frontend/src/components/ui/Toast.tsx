import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastCtx {
  success: (title: string, description?: string) => void
  error:   (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info:    (title: string, description?: string) => void
}

const ToastContext = createContext<ToastCtx>({
  success: () => {}, error: () => {}, warning: () => {}, info: () => {},
})

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info }

const ACCENT: Record<ToastType, string> = {
  success: 'var(--success)',
  error:   'var(--danger)',
  warning: 'var(--warning)',
  info:    'var(--primary)',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon   = ICONS[toast.type]
  const accent = ACCENT[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,   scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-start gap-3 rounded-2xl px-4 py-3.5 min-w-[300px] max-w-[380px]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderLeft: `3px solid ${accent}`,
        boxShadow: 'var(--shadow-lg)',
      }}>
      <Icon size={17} style={{ color: accent }} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="t-body font-semibold" style={{ color: 'var(--text)' }}>{toast.title}</p>
        {toast.description && (
          <p className="t-caption mt-0.5" style={{ color: 'var(--text2)' }}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--card2)]"
        style={{ color: 'var(--text3)' }}>
        <X size={12} />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const remove = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const add = useCallback((type: ToastType, title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(p => [{ id, type, title, description }, ...p].slice(0, 5))
    timers.current[id] = setTimeout(() => remove(id), 4500)
  }, [remove])

  const ctx: ToastCtx = {
    success: (t, d) => add('success', t, d),
    error:   (t, d) => add('error',   t, d),
    warning: (t, d) => add('warning', t, d),
    info:    (t, d) => add('info',    t, d),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-2.5 pointer-events-none"
        style={{ zIndex: 400 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onRemove={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
