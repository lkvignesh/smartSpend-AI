import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import {
  LayoutDashboard, ReceiptText, Wallet, Target, BarChart3,
  Sparkles, Settings, LogOut, ChevronLeft, ChevronRight,
  Sun, Moon, Bell, Search, Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  path: string
  Icon: LucideIcon
  soon?: boolean
}

const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
  { label: 'Expenses',  path: '/expenses',  Icon: ReceiptText },
  { label: 'Income',    path: '/income',    Icon: Wallet,     soon: true },
  { label: 'Goals',     path: '/goals',     Icon: Target },
  { label: 'Analytics', path: '/analytics', Icon: BarChart3,  soon: true },
  { label: 'AI Advisor',path: '/ai',        Icon: Sparkles },
]

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const userName  = String(user?.full_name ?? 'User')
  const userEmail = String(user?.email ?? '')
  const initial   = userName.charAt(0).toUpperCase() || 'U'

  const handleNav = (path: string, soon?: boolean) => {
    if (soon) return
    navigate(path)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>

      {/* ── Desktop sidebar ─────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative hidden md:flex flex-col h-full shrink-0 overflow-hidden"
        style={{ background: 'var(--c-surface)', borderRight: '1px solid var(--c-border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 shrink-0"
          style={{ height: 64, borderBottom: '1px solid var(--c-border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-[15px] whitespace-nowrap tracking-tight"
                style={{ color: 'var(--c-text)' }}>
                FinancePilot
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--c-text3)' }}>
              Menu
            </p>
          )}
          {MAIN_NAV.map(({ label, path, Icon, soon }) => {
            const active = pathname === path
            return (
              <div key={path} className="relative">
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <button
                  onClick={() => handleNav(path, soon)}
                  title={soon ? `${label} — coming soon` : label}
                  className={`w-full flex items-center rounded-xl transition-all text-left
                    ${collapsed ? 'justify-center h-11 px-0' : 'gap-3 h-11 px-3'}
                    ${soon ? 'opacity-40 cursor-default' : 'cursor-pointer'}
                    ${active ? '' : 'hover:bg-[rgba(37,99,235,0.06)]'}`}
                  style={{
                    background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
                    color: active ? '#2563EB' : 'var(--c-text2)',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className={`text-[14px] flex-1 ${active ? 'font-semibold' : 'font-medium'}`}>
                        {label}
                      </span>
                      {soon && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                          Soon
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 shrink-0" style={{ borderTop: '1px solid var(--c-border)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
              style={{ background: 'var(--c-s2)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate leading-tight" style={{ color: 'var(--c-text)' }}>
                  {userName}
                </p>
                <p className="text-[11px] truncate leading-tight mt-0.5" style={{ color: 'var(--c-text3)' }}>
                  {userEmail}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center rounded-xl h-10 transition-colors hover:bg-[rgba(37,99,235,0.06)]
              ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
            style={{ color: 'var(--c-text2)' }}>
            <Settings size={18} />
            {!collapsed && <span className="text-[13px] font-medium">Settings</span>}
          </button>

          <button
            onClick={logout}
            className={`w-full flex items-center rounded-xl h-10 transition-colors hover:bg-red-500/8
              ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
            style={{ color: '#EF4444' }}>
            <LogOut size={18} />
            {!collapsed && <span className="text-[13px] font-medium">Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-4 -right-3.5 w-7 h-7 rounded-full flex items-center justify-center
            transition-all hover:scale-110 z-10"
          style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            color: 'var(--c-text3)',
            boxShadow: 'var(--c-shadow)',
          }}>
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </motion.aside>

      {/* ── Mobile bottom nav ──────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ height: 64, background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
        {MAIN_NAV.filter(n => !n.soon).map(({ label, path, Icon }) => {
          const active = pathname === path
          return (
            <button key={path}
              onClick={() => handleNav(path)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: active ? '#2563EB' : 'var(--c-text3)' }}
              aria-current={active ? 'page' : undefined}>
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* ── Main area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 shrink-0 sticky top-0 z-20"
          style={{ height: 64, background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>

          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-tight" style={{ color: 'var(--c-text)' }}>
              {greeting()},{' '}
              <span className="grad-text">{userName.split(' ')[0]}</span>
            </p>
            <p className="text-[12px] leading-tight mt-0.5" style={{ color: 'var(--c-text3)' }}>
              {formatDate()}
            </p>
          </div>

          {/* Search */}
          <div className="flex-1 lg:flex-none flex items-center gap-2.5 px-4 rounded-xl max-w-xs"
            style={{ height: 40, background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
            <Search size={15} style={{ color: 'var(--c-text3)' }} />
            <span className="text-[13px]" style={{ color: 'var(--c-text3)' }}>Search…</span>
          </div>

          {/* Quick add */}
          <button
            onClick={() => navigate('/expenses')}
            className="hidden sm:flex items-center gap-2 px-4 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
            style={{ height: 40, background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Plus size={15} />
            <span>Add</span>
          </button>

          {/* Notifications */}
          <button aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-[rgba(37,99,235,0.07)]"
            style={{ color: 'var(--c-text2)' }}>
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
              style={{ background: '#EF4444' }} />
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-[rgba(37,99,235,0.07)]"
            style={{ color: 'var(--c-text2)' }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 cursor-default"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            {initial}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '32px', paddingBottom: '80px' }}>
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
