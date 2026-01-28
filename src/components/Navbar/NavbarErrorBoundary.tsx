import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
}

class NavbarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Navbar error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }

    return this.props.children
  }
}

export { NavbarErrorBoundary }
