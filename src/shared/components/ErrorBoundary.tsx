import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error("🚨 Error Boundary caught an error:", error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🚨</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>

              {this.state.error && (
                <details className="text-left bg-gray-100 p-4 rounded-lg mb-4">
                  <summary className="font-semibold text-gray-700 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
                    <p>
                      <strong>Stack:</strong>
                    </p>
                    <pre className="whitespace-pre-wrap text-xs bg-gray-200 p-2 rounded mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: undefined,
                      errorInfo: undefined,
                    })
                  }
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
