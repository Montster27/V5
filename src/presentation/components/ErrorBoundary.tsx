import React, { Component, ErrorInfo } from 'react';
import { EventBus } from '../../application/EventBus';

interface Props {
  children: React.ReactNode;
  eventBus: EventBus;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.eventBus.emit('error:system', {
      error,
      componentStack: info.componentStack
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || 'An error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}