import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error.message)
    console.error(info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#08080F] p-6">
          <p className="text-lg font-semibold text-[#FF5C7C]">Something went wrong</p>
          <p className="text-sm text-[#8A8AA0] max-w-sm text-center">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/auth/login' }}
            className="px-6 py-2.5 rounded-xl text-white font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
          >
            Back to login
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
