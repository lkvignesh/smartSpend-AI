import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Palette, Bell, Shield, LogOut, ChevronRight,
  Sun, Moon, Check, Settings as SettingsIcon,
} from 'lucide-react'
import { useAuth }  from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { Avatar }   from '@/components/ui/Avatar'
import { Badge }    from '@/components/ui/Badge'
import { Button }   from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

type Section = 'profile' | 'appearance' | 'notifications' | 'security'

const NAV: { id: Section; icon: typeof User; label: string; desc: string }[] = [
  { id: 'profile',       icon: User,    label: 'Profile',       desc: 'Name, email, currency' },
  { id: 'appearance',    icon: Palette, label: 'Appearance',    desc: 'Theme, display' },
  { id: 'notifications', icon: Bell,    label: 'Notifications', desc: 'Alerts and reminders' },
  { id: 'security',      icon: Shield,  label: 'Security',      desc: 'Password, sessions' },
]

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5"
      style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
        {desc && <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="w-11 h-6 rounded-full transition-all relative shrink-0"
      style={{ background: enabled ? 'var(--primary)' : 'var(--card2)', border: '1px solid var(--border2)' }}>
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </button>
  )
}

function ProfileSection({ user }: { user: any }) {
  const toast = useToast()
  return (
    <div>
      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl"
        style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>
        <Avatar name={user?.full_name ?? 'User'} size="xl" />
        <div>
          <p className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{user?.full_name}</p>
          <p className="t-body mt-0.5" style={{ color: 'var(--text3)' }}>{user?.email}</p>
          <Badge variant="gradient" size="sm" className="mt-2">Pro Member</Badge>
        </div>
      </div>

      <SettingRow label="Full Name" desc="Your display name">
        <span className="text-[13px] font-medium" style={{ color: 'var(--text2)' }}>{user?.full_name}</span>
      </SettingRow>
      <SettingRow label="Email" desc="Login and notification email">
        <span className="text-[13px] font-medium" style={{ color: 'var(--text2)' }}>{user?.email}</span>
      </SettingRow>
      <SettingRow label="Currency" desc="Used for all financial displays">
        <span className="text-[13px] font-medium" style={{ color: 'var(--text2)' }}>
          {user?.currency ?? 'INR'} (₹)
        </span>
      </SettingRow>

      <div className="mt-6">
        <Button variant="primary" onClick={() => toast.info('Profile editing coming soon!')}>
          Edit Profile
        </Button>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const { theme, isDark, toggle } = useTheme()
  return (
    <div>
      <SettingRow label="Theme" desc="Choose your preferred appearance">
        <div className="flex gap-2">
          {[{ v: 'dark', icon: Moon, label: 'Dark' }, { v: 'light', icon: Sun, label: 'Light' }].map(({ v, icon: Icon, label }) => (
            <button
              key={v}
              onClick={() => { if (theme !== v) toggle() }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: theme === v ? 'var(--primary-dim)' : 'var(--card2)',
                border: `1px solid ${theme === v ? 'var(--primary)' : 'var(--border2)'}`,
                color: theme === v ? 'var(--primary)' : 'var(--text2)',
              }}>
              <Icon size={14} />
              {label}
              {theme === v && <Check size={12} />}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Compact mode" desc="Reduce card padding and spacing">
        <Toggle enabled={false} onChange={() => {}} />
      </SettingRow>
      <SettingRow label="Animations" desc="Motion and transitions">
        <Toggle enabled={true} onChange={() => {}} />
      </SettingRow>
    </div>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    spending_alerts:  true,
    goal_milestones:  true,
    weekly_summary:   true,
    ai_suggestions:   false,
    budget_warnings:  true,
  })
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const ITEMS = [
    { key: 'spending_alerts'  as const, label: 'Spending Alerts',  desc: 'Alert when a large expense is recorded' },
    { key: 'goal_milestones'  as const, label: 'Goal Milestones',  desc: 'Celebrate when you hit a savings milestone' },
    { key: 'weekly_summary'   as const, label: 'Weekly Summary',   desc: 'Receive a weekly financial digest' },
    { key: 'ai_suggestions'   as const, label: 'AI Suggestions',   desc: 'Personalised AI recommendations' },
    { key: 'budget_warnings'  as const, label: 'Budget Warnings',  desc: 'Alert when approaching spending limits' },
  ]

  return (
    <div>
      {ITEMS.map(({ key, label, desc }) => (
        <SettingRow key={key} label={label} desc={desc}>
          <Toggle enabled={prefs[key]} onChange={() => toggle(key)} />
        </SettingRow>
      ))}
    </div>
  )
}

function SecuritySection({ logout }: { logout: () => void }) {
  const toast = useToast()
  return (
    <div>
      <SettingRow label="Password" desc="Last changed: Never">
        <Button variant="secondary" size="sm" onClick={() => toast.info('Password change coming soon!')}>
          Change
        </Button>
      </SettingRow>
      <SettingRow label="Two-factor authentication" desc="Adds an extra layer of security">
        <Toggle enabled={false} onChange={() => toast.info('2FA coming soon!')} />
      </SettingRow>
      <SettingRow label="Active sessions" desc="Devices currently signed in">
        <span className="t-small font-medium" style={{ color: 'var(--text2)' }}>1 device</span>
      </SettingRow>

      <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <Button variant="danger" onClick={logout}>
          <LogOut size={15} /> Sign out of all devices
        </Button>
      </div>
    </div>
  )
}

export default function Settings() {
  const [active, setActive] = useState<Section>('profile')
  const { user, logout }    = useAuth()

  const currentSection = NAV.find(n => n.id === active)!

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--grad)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
          <SettingsIcon size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Settings</h1>
          <p className="t-body" style={{ color: 'var(--text2)' }}>Manage your account and preferences</p>
        </div>
      </motion.div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Sidebar nav */}
        <nav className="lg:col-span-1 fp-card p-3 space-y-0.5 h-fit">
          {NAV.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all"
              style={{
                background: active === id ? 'var(--primary-dim)' : 'transparent',
                color: active === id ? 'var(--primary)' : 'var(--text2)',
              }}>
              <Icon size={16} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">{label}</p>
                <p className="t-small truncate" style={{ color: active === id ? 'var(--primary)' : 'var(--text3)' }}>
                  {desc}
                </p>
              </div>
              <ChevronRight size={13} className={active === id ? 'opacity-60' : 'opacity-0'} />
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 fp-card p-6">
          <div className="mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{currentSection.label}</p>
            <p className="t-small mt-0.5" style={{ color: 'var(--text3)' }}>{currentSection.desc}</p>
          </div>

          {active === 'profile'       && <ProfileSection user={user} />}
          {active === 'appearance'    && <AppearanceSection />}
          {active === 'notifications' && <NotificationsSection />}
          {active === 'security'      && <SecuritySection logout={logout} />}
        </div>
      </div>
    </div>
  )
}
