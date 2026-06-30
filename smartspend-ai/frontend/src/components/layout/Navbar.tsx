import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Bell, Sun, Moon, Command } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { getGreeting, getFormattedDate } from '@/lib/utils'

export function Navbar() {
  const { user } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className="flex items-center gap-4 px-6 shrink-0 sticky top-0 z-20"
      style={{
        height: 'var(--topbar-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}>

      {/* ── Greeting ─────────────────────────────── */}
      <div className="hidden lg:block flex-1 min-w-0">
        <p className="text-[14px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>
          {getGreeting()},{' '}
          <span className="grad-text">{user?.full_name?.split(' ')[0] ?? 'there'}</span>
        </p>
        <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--text3)' }}>
          {getFormattedDate()}
        </p>
      </div>

      {/* ── Search ───────────────────────────────── */}
      <motion.div
        animate={{ width: searchFocused ? 320 : 200 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex items-center gap-2.5 px-3.5 rounded-xl cursor-text"
        style={{
          height: 38,
          background: 'var(--card)',
          border: `1px solid ${searchFocused ? 'var(--primary)' : 'var(--border2)'}`,
          boxShadow: searchFocused ? '0 0 0 3px var(--primary-dim)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onClick={() => setSearchFocused(true)}>
        <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
        <input
          type="search"
          placeholder="Search…"
          className="flex-1 bg-transparent text-[13px] focus:outline-none min-w-0"
          style={{ color: 'var(--text)' }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <AnimatePresence>
          {!searchFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-0.5 shrink-0">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md t-small"
                style={{ background: 'var(--card2)', color: 'var(--text3)' }}>
                <Command size={10} /> K
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Quick add ────────────────────────────── */}
      <button
        onClick={() => navigate('/expenses')}
        className="hidden sm:flex items-center gap-2 px-4 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 shrink-0"
        style={{
          height: 38,
          background: 'var(--grad)',
          boxShadow: '0 3px 12px rgba(59,130,246,0.3)',
        }}>
        <Plus size={15} />
        <span>Add</span>
      </button>

      {/* ── Notifications ────────────────────────── */}
      <button
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--card)]"
        style={{ color: 'var(--text2)', flexShrink: 0 }}>
        <Bell size={17} />
        <span
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--danger)' }}
        />
      </button>

      {/* ── Theme toggle ─────────────────────────── */}
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-[var(--card)] shrink-0"
        style={{ color: 'var(--text2)' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? 'sun' : 'moon'}
            initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.18 }}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* ── Avatar ───────────────────────────────── */}
      <button
        onClick={() => navigate('/settings')}
        aria-label="Profile"
        className="shrink-0 transition-opacity hover:opacity-80">
        <Avatar name={user?.full_name ?? 'User'} size="sm" />
      </button>
    </header>
  )
}
