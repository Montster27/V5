import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  serviceName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ServiceIntegrationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to your error monitoring service
    console.error(`Service Integration Error in ${this.props.serviceName}:`, {
      error,
      errorInfo
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="w-full max-w-md mx-auto my-4">
          <AlertTitle>Service Error</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p>
                An error occurred in the {this.props.serviceName} integration.
                {this.state.error?.message && (
                  <span className="block text-sm opacity-75">
                    Details: {this.state.error.message}
                  </span>
                )}
              </p>
              <button
                onClick={this.handleRetry}
                className="px-3 py-1 text-sm bg-white/10 rounded hover:bg-white/20"
              >
                Retry
              </button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}