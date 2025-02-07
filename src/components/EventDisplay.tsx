import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventDisplayProps } from '../types/events';

interface EventDisplayComponentProps {
  event: EventDisplayProps;
  onChooseOption: (optionId: string) => void;
  onTimeExpired?: () => void;
}

const EventDisplay: React.FC<EventDisplayComponentProps> = ({ 
  event, 
  onChooseOption,
  onTimeExpired 
}) => {
  const [timeLeft, setTimeLeft] = useState(event.timeLimit || 30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!event.timeLimit) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event.timeLimit, onTimeExpired]);

  const handleOptionClick = useCallback((optionId: string) => {
    if (selectedOption) return; // Prevent multiple selections
    setSelectedOption(optionId);
    onChooseOption(optionId);
  }, [onChooseOption, selectedOption]);

  const formatEffect = (type: string, value: number): string => {
    switch (type) {
      case 'money':
        return value > 0 ? `+$${value}` : `-$${Math.abs(value)}`;
      case 'social':
        return `${value > 0 ? '+' : ''}${value} social`;
      case 'energy':
        return `${value > 0 ? '+' : ''}${value} energy`;
      case 'stress':
        return `${value > 0 ? '+' : ''}${value} stress`;
      default:
        return `${value}`;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.title}</span>
          {event.timeLimit && (
            <span className="text-sm font-normal" data-testid="event-timer">
              {timeLeft}s
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
        <div className="flex flex-col gap-2">
          {event.options.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              variant="outline"
              className="w-full text-left justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={!!selectedOption}
              data-testid={`choice-${option.id}`}
            >
              <div className="flex flex-col w-full">
                <span>{option.text}</span>
                {option.consequences && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Object.entries(option.consequences.resources || {}).map(([type, value]) => (
                      <span key={type} className="mr-2" data-testid={`effect-${type}`}>
                        {formatEffect(type, value)}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDisplay;