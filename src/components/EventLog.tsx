import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';

interface Event {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const EventLog: React.FC = () => {
  // This would normally come from your game state
  const events: Event[] = [
    {
      id: '1',
      timestamp: '8:00 AM',
      message: 'Started morning classes',
      type: 'info'
    },
    {
      id: '2',
      timestamp: '10:30 AM',
      message: 'Successfully completed study session',
      type: 'success'
    },
    {
      id: '3',
      timestamp: '12:00 PM',
      message: 'Energy levels running low',
      type: 'warning'
    }
  ];

  const getEventStyles = (type: Event['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-3">
        {events.map((event) => (
          <Alert key={event.id} className={`${getEventStyles(event.type)} border-l-4`}>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              {event.timestamp}
            </div>
            <AlertDescription>
              {event.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </ScrollArea>
  );
};