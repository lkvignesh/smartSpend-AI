import { useState } from 'react'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Divider, IconButton } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Expenses', path: '/expenses', icon: ReceiptLongIcon },
  { label: 'Income', path: '/income', icon: TrendingUpIcon },
  { label: 'Analytics', path: '/analytics', icon: BarChartIcon },
  { label: 'Goals', path: '/goals', icon: TrackChangesIcon },
  { label: 'AI Advisor', path: '/ai', icon: SmartToyIcon },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const w = collapsed ? 68 : DRAWER_WIDTH
  const userName = String(user?.full_name ?? 'User')
  const userEmail = String(user?.email ?? '')
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer variant="permanent" sx={{ width: w, flexShrink: 0,
        '& .MuiDrawer-paper': { width: w, overflowX: 'hidden', transition: 'width 0.2s',
          background: '#0D0D14', borderRight: '1px solid rgba(255,255,255,0.06)' } }}>

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between', minHeight: 64 }}>
          {!collapsed && (
            <Typography fontWeight={700} fontSize={17}
              sx={{ background: 'linear-gradient(135deg,#6C63FF,#00D4AA)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SmartSpend
            </Typography>
          )}
          <IconButton size="small" onClick={() => setCollapsed(v => !v)}
            sx={{ color: 'text.secondary' }}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <List sx={{ px: 1, flex: 1, mt: 1 }}>
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = pathname === path
            return (
              <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => navigate(path)}
                  sx={{ borderRadius: 2, minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: active ? 'rgba(108,99,255,0.15)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(108,99,255,0.08)' } }}>
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36,
                    color: active ? '#6C63FF' : 'text.secondary' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={label}
                      primaryTypographyProps={{ fontSize: 14,
                        fontWeight: active ? 600 : 400,
                        color: active ? '#6C63FF' : 'text.primary' }} />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <Box sx={{ p: 1.5 }}>
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5,
              p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#6C63FF', fontSize: 13 }}>
                {userInitial}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontSize={13} fontWeight={600} noWrap>{userName}</Typography>
                <Typography fontSize={11} color="text.secondary" noWrap>{userEmail}</Typography>
              </Box>
            </Box>
          )}
          <ListItemButton onClick={() => navigate('/settings')}
            sx={{ borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start', mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'text.secondary' }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Settings"
              primaryTypographyProps={{ fontSize: 14 }} />}
          </ListItemButton>
          <ListItemButton onClick={logout}
            sx={{ borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: '#FF5C7C' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Sign out"
              primaryTypographyProps={{ fontSize: 14, color: '#FF5C7C' }} />}
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0,
        bgcolor: 'background.default', p: 3, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
