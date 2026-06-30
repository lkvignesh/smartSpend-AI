import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ReceiptText, Target, Sparkles,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

const MOBILE_NAV = [
  { path: '/dashboard', Icon: LayoutDashboard, label: 'Home' },
  { path: '/expenses',  Icon: ReceiptText,      label: 'Expenses' },
  { path: '/goals',     Icon: Target,           label: 'Goals' },
  { path: '/ai',        Icon: Sparkles,         label: 'AI' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── Desktop sidebar ─── */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </div>

      {/* ── Main area ───────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main
          className="flex-1 overflow-y-auto fp-scroll"
          style={{ padding: '40px 48px 96px' }}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex"
        style={{
          height: 64,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          zIndex: 50,
        }}>
        {MOBILE_NAV.map(({ path, Icon, label }) => {
          const active = pathname === path
          return (
            <button key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: active ? 'var(--primary)' : 'var(--text3)' }}>
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
