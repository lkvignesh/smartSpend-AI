import { useState } from 'react'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Divider, IconButton, Tooltip } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
  { label: 'Income', icon: <TrendingUpIcon />, path: '/income' },
  { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { label: 'Goals', icon: <TrackChangesIcon />, path: '/goals' },
  { label: 'AI Advisor', icon: <SmartToyIcon />, path: '/ai' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const width = collapsed ? 72 : DRAWER_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer variant="permanent" sx={{ width, flexShrink: 0,
        '& .MuiDrawer-paper': { width, overflowX: 'hidden', transition: 'width 0.2s', boxSizing: 'border-box',
          background: 'rgba(19,19,26,0.95)', backdropFilter: 'blur(20px)', border: 'none',
          borderRight: '1px solid rgba(255,255,255,0.06)' } }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <Typography fontWeight={700} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 18 }}>
              SmartSpend
            </Typography>
          )}
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)} sx={{ color: 'text.secondary' }}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <List sx={{ px: 1, flex: 1, mt: 1 }}>
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={collapsed ? item.label : ''} placement="right">
                  <ListItemButton onClick={() => navigate(item.path)} sx={{ borderRadius: 2, minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: active ? 'rgba(108,99,255,0.15)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(108,99,255,0.1)' } }}>
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: active ? 'primary.main' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? 'primary.main' : 'text.primary' }} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ p: 1.5 }}>
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                {String(user?.full_name || '?')[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontSize={13} fontWeight={600} noWrap>{String(user?.full_name || '')}</Typography>
                <Typography fontSize={11} color="text.secondary" noWrap>{String(user?.email || '')}</Typography>
              </Box>
            </Box>
          )}
          <Tooltip title={collapsed ? 'Settings' : ''} placement="right">
            <ListItemButton onClick={() => navigate('/settings')} sx={{ borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'text.secondary' }}><SettingsIcon fontSize="small" /></ListItemIcon>
              {!collapsed && <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 14, color: 'text.primary' }} />}
            </ListItemButton>
          </Tooltip>
          <Tooltip title={collapsed ? 'Sign out' : ''} placement="right">
            <ListItemButton onClick={logout} sx={{ borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'error.main' }}><LogoutIcon fontSize="small" /></ListItemIcon>
              {!collapsed && <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: 14, color: 'error.main' }} />}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: 'background.default', p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
