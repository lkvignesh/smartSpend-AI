import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, ReceiptText, Target, Bot,
  Menu, LogOut, Settings, ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface NavItem { label: string; path: string; Icon: LucideIcon }

// CRITICAL: store component references, NEVER JSX elements (<Icon />)
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard },
  { label: 'Expenses',  path: '/expenses',  Icon: ReceiptText },
  { label: 'Goals',     path: '/goals',     Icon: Target },
  { label: 'AI Advisor',path: '/ai',        Icon: Bot },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const userName = String(user?.full_name ?? 'User')
  const userEmail = String(user?.email ?? '')
  const userInitial = userName.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col shrink-0 transition-all duration-200',
          'bg-[#0D0D14] border-r border-white/[0.06]',
          collapsed ? 'w-[68px]' : 'w-60',
        )}
      >
        {/* Logo row */}
        <div className={clsx(
          'flex items-center min-h-[64px] px-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}>
          {!collapsed && (
            <span className="font-bold text-[17px] bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
              SmartSpend
            </span>
          )}
          <button
            onClick={() => setCollapsed(v => !v)}
            className="p-1.5 rounded-lg text-[#8A8AA0] hover:text-[#F0F0FF] hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="border-t border-white/[0.06]" />

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV_ITEMS.map(({ label, path, Icon }) => {
            const active = pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left',
                  collapsed ? 'justify-center' : '',
                  active
                    ? 'bg-[#6C63FF]/15 text-[#6C63FF]'
                    : 'text-[#8A8AA0] hover:bg-white/[0.05] hover:text-[#F0F0FF]',
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className={clsx('text-sm', active ? 'font-semibold' : 'font-normal')}>
                    {label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/[0.06]" />

        {/* User section */}
        <div className="p-2 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] mb-1">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate text-[#F0F0FF]">{userName}</p>
                <p className="text-[11px] text-[#8A8AA0] truncate">{userEmail}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/settings')}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#8A8AA0] hover:bg-white/[0.05] hover:text-[#F0F0FF] transition-colors',
              collapsed ? 'justify-center' : '',
            )}
          >
            <Settings size={16} className="shrink-0" />
            {!collapsed && <span className="text-sm">Settings</span>}
          </button>

          <button
            onClick={logout}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF5C7C] hover:bg-[#FF5C7C]/10 transition-colors',
              collapsed ? 'justify-center' : '',
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span className="text-sm">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-[#08080F] p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
