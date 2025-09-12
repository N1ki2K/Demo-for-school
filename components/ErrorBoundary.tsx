import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Schedule navigation after rendering is complete
    setTimeout(() => {
      window.location.href = '/404';
    }, 0);
  }

  render() {
    if (this.state.hasError) {
      // Return error UI instead of causing side effects during render
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Нещо се обърка</h1>
            <p className="text-gray-600 mb-6">Възникна неочаквана грешка. Моля, опитайте отново.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors mr-4"
            >
              Презареди страницата
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Начало
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;