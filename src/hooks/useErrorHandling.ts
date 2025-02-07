import { useCallback } from 'react';
import { ErrorReporting } from '../utils/error-reporting';
import { Activity } from '../services/activities/types';

interface ErrorHandlerOptions {
  service?: string;
  activity?: Activity;
  additionalData?: Record<string, unknown>;
}

export function useErrorHandling(options: ErrorHandlerOptions = {}) {
  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    const errorReporting = ErrorReporting.getInstance();
    
    errorReporting.reportError(error, {
      service: options.service,
      activity: options.activity && {
        id: options.activity.id,
        name: options.activity.name,
        type: options.activity.type
      },
      componentStack: errorInfo.componentStack,
      additionalData: options.additionalData
    });
  }, [options]);

  const handleActivityFallback = useCallback((activity: Activity) => {
    // Here we could implement specific recovery strategies for activities
    console.warn(`Activity fallback triggered for: ${activity.name}`);
  }, []);

  return {
    handleError,
    handleActivityFallback
  };
}