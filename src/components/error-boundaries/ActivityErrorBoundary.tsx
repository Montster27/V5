import React from 'react';
import { ServiceIntegrationErrorBoundary } from './ServiceIntegrationErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity } from '../../services/activities/types';

interface Props {
  children: React.ReactNode;
  activity?: Activity;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onActivityFallback?: (activity: Activity) => void;
}

export const ActivityErrorBoundary: React.FC<Props> = ({ 
  children, 
  activity,
  onError,
  onActivityFallback 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // If we have an activity and fallback handler, try to handle the activity
    if (activity && onActivityFallback) {
      onActivityFallback(activity);
    }
    
    // Call the main error handler if provided
    onError?.(error, errorInfo);
  };

  const fallbackComponent = (
    <Alert className="w-full max-w-md mx-auto my-4">
      <AlertTitle>Activity System Issue</AlertTitle>
      <AlertDescription>
        <div className="space-y-4">
          <p>
            There was a problem processing this activity. 
            {activity && (
              <span className="block text-sm mt-1">
                Activity: {activity.name}
              </span>
            )}
          </p>
          <div className="text-sm opacity-75">
            <p>The following features may be affected:</p>
            <ul className="list-disc pl-4 mt-2">
              <li>Activity completion and rewards</li>
              <li>Skill XP gains</li>
              <li>Resource updates</li>
              <li>State changes</li>
            </ul>
          </div>
          <div className="text-sm bg-white/5 p-3 rounded">
            <p className="font-medium">Alternative options:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Try a different activity</li>
              <li>Take a break and return later</li>
              <li>Focus on non-skill activities</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <ServiceIntegrationErrorBoundary
      serviceName="Activity System"
      fallback={fallbackComponent}
      onError={handleError}
    >
      {children}
    </ServiceIntegrationErrorBoundary>
  );
};