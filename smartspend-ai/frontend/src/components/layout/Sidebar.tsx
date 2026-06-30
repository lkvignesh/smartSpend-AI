import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ReceiptText, Wallet, Target, BarChart3, Sparkles,
  Settings, LogOut, ChevronLeft, ChevronRight, TrendingUp,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: typeof LayoutDashboard
  badge?: string
  soon?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  path: '/dashboard', icon: LayoutDashboard },
  { label: 'Expenses',   path: '/expenses',  icon: ReceiptText },
  { label: 'Income',     path: '/income',    icon: Wallet,    soon: true },
  { label: 'Goals',      path: '/goals',     icon: Target },
  { label: 'Analytics',  path: '/analytics', icon: BarChart3 },
  { label: 'AI Advisor', path: '/ai',        icon: Sparkles, badge: 'AI' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate   = useNavigate()
  const { pathname } = useLocation()

  const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

  return (
    <motion.aside
      animate={{ width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
      transition={{ duration: 0.22, ease: EASE }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}>

      {/* ── Logo ─────────────────────────────────── */}
      <div
        className="flex items-center shrink-0 overflow-hidden"
        style={{ height: 'var(--topbar-h)', paddingLeft: collapsed ? 18 : 20, borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--grad)' }}>
          <TrendingUp size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="ml-3 overflow-hidden whitespace-nowrap">
              <span className="font-bold text-[15px] tracking-tight" style={{ color: 'var(--text)' }}>
                Finance
              </span>
              <span className="font-bold text-[15px] tracking-tight grad-text">Pilot</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <nav className="flex-1 overflow-y-auto fp-scroll px-2 py-4 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2 t-label" style={{ color: 'var(--text3)' }}>Navigation</p>
        )}
        {NAV_ITEMS.map(({ label, path, icon: Icon, badge, soon }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
          return (
            <div key={path} className="relative">
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                  style={{ background: 'var(--grad)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <button
                onClick={() => { if (!soon) navigate(path) }}
                title={collapsed ? label : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all',
                  collapsed ? 'justify-center h-11 px-0' : 'gap-3 h-11 px-3',
                  soon && 'opacity-40 cursor-default',
                  active
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--card)]',
                )}
                style={active ? { background: 'var(--primary-dim)' } : {}}>
                <Icon
                  size={20}
                  className="shrink-0"
                  style={active ? {
                    filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))',
                  } : {}}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className={cn('text-[13px]', active ? 'font-semibold' : 'font-medium')}>
                        {label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {badge && <Badge variant="gradient" size="sm">{badge}</Badge>}
                        {soon  && <Badge variant="neutral"  size="sm">Soon</Badge>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )
        })}
      </nav>

      {/* ── User card ────────────────────────────── */}
      <div className="shrink-0 px-2 py-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            'w-full flex items-center rounded-xl h-9 transition-colors text-[13px] font-medium',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--card)]',
          )}>
          <Settings size={17} />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center rounded-xl h-9 transition-all text-[13px] font-medium',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            'text-[var(--text3)] hover:text-[var(--danger)] hover:bg-[var(--danger-dim)]',
          )}>
          <LogOut size={17} />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Profile card */}
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-1">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'var(--card)' }}>
                <Avatar name={user.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {user.full_name}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: 'var(--text3)' }}>
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Collapse toggle ──────────────────────── */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute top-[21px] -right-3.5 w-7 h-7 rounded-full flex items-center justify-center
          transition-all hover:scale-110 z-10"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          color: 'var(--text3)',
          boxShadow: 'var(--shadow-sm)',
        }}>
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </motion.aside>
  )
}
