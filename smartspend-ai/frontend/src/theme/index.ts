import { createTheme, alpha } from '@mui/material/styles'

const palette = {
  primary: { main: '#6C63FF', light: '#8B85FF', dark: '#4B44CC' },
  secondary: { main: '#00D4AA', light: '#33DDBB', dark: '#009977' },
  success: { main: '#00C896' },
  warning: { main: '#FFB547' },
  error: { main: '#FF5C7C' },
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
    background: { default: '#0A0A0F', paper: '#13131A' },
    text: { primary: '#F0F0FF', secondary: '#8A8AA0' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, padding: '10px 20px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #8B85FF 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #5B52EE 0%, #7A74EE 100%)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
    },
  },
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
    background: { default: '#F5F5FF', paper: '#FFFFFF' },
    text: { primary: '#1A1A2E', secondary: '#6B6B80' },
  },
  shape: { borderRadius: 14 },
  typography: darkTheme.typography,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: darkTheme.components!.MuiButton,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
          },
        },
      },
    },
  },
})
