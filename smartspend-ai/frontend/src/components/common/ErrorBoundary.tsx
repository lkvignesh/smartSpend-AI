import { Component, ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    console.error('=== REACT ERROR BOUNDARY ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    console.error('Component Stack:', info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 2,
          background: '#0A0A0F', p: 4
        }}>
          <Typography variant="h5" color="error" fontWeight={600}>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" fontSize={14} sx={{ maxWidth: 500, textAlign: 'center' }}>
            {this.state.error?.message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              localStorage.clear()
              window.location.href = '/auth/login'
            }}
          >
            Back to login
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
