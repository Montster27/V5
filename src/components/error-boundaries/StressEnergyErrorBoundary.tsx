import React from 'react';
import { ServiceIntegrationErrorBoundary } from './ServiceIntegrationErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const StressEnergyErrorBoundary: React.FC<Props> = ({ children, onError }) => {
  const fallbackComponent = (
    <Alert className="w-full max-w-md mx-auto my-4" variant="destructive">
      <AlertDescription>
        <div className="space-y-4">
          <p>
            The stress/energy system is experiencing issues. The game will use
            default values until the system recovers.
          </p>
          <div className="text-sm opacity-75">
            <p>Temporary limitations:</p>
            <ul className="list-disc pl-4 mt-2">
              <li>Standard energy drain rates</li>
              <li>Default stress accumulation</li>
              <li>Basic recovery mechanics</li>
              <li>No skill-based modifications</li>
            </ul>
          </div>
          <p className="text-sm">
            Your character's state is preserved and will update once the system
            recovers.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <ServiceIntegrationErrorBoundary
      serviceName="Stress & Energy System"
      fallback={fallbackComponent}
      onError={onError}
    >
      {children}
    </ServiceIntegrationErrorBoundary>
  );
};