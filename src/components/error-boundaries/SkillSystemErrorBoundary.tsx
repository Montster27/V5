import React from 'react';
import { ServiceIntegrationErrorBoundary } from './ServiceIntegrationErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const SkillSystemErrorBoundary: React.FC<Props> = ({ children, onError }) => {
  const fallbackComponent = (
    <Alert className="w-full max-w-md mx-auto my-4">
      <AlertDescription>
        <div className="space-y-4">
          <p>
            The skill system is temporarily unavailable. Your progress is safe,
            but skill gains and modifications may not be applied correctly.
          </p>
          <div className="text-sm opacity-75">
            <p>You can continue playing, but you may experience:</p>
            <ul className="list-disc pl-4 mt-2">
              <li>Default skill modifiers being applied</li>
              <li>No skill XP gains from activities</li>
              <li>Standard stress/energy calculations without skill bonuses</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <ServiceIntegrationErrorBoundary
      serviceName="Skill System"
      fallback={fallbackComponent}
      onError={onError}
    >
      {children}
    </ServiceIntegrationErrorBoundary>
  );
};