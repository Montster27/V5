import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeChoice, clearEvent } from '../../application/store/eventSlice';
import { modifyResource } from '../../application/store/resourceSlice';
import { performanceMonitor } from '../../infrastructure/monitoring/PerformanceMonitor';
import { errorHandler } from '../../infrastructure/error/ErrorHandler';
import { ErrorType, ErrorLevel } from '../../domain/types/errors';

interface Choice {
  id: string;
  text: string;
  effects: Record<string, number>;
}

interface Event {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  timeLimit: number;
}

export const EventDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state: any) => state.events.current) as Event | null;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    if (currentEvent) {
      setTimeLeft(currentEvent.timeLimit);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentEvent]);

  const handleTimeExpired = () => {
    try {
      performanceMonitor.startMeasurement('handle_time_expired');
      
      if (currentEvent?.choices.length) {
        // Select safest choice (least negative effects)
        const safestChoice = currentEvent.choices.reduce((prev, curr) => {
          const prevNegativeSum = Object.values(prev.effects).reduce(
            (sum, val) => sum + (val < 0 ? val : 0), 0
          );
          const currNegativeSum = Object.values(curr.effects).reduce(
            (sum, val) => sum + (val < 0 ? val : 0), 0
          );
          return prevNegativeSum > currNegativeSum ? curr : prev;
        });
        
        handleChoiceSelection(safestChoice.id);
      }
      
      dispatch(clearEvent());
    } catch (error) {
      errorHandler.handleError(
        error as Error,
        ErrorType.GAME_LOGIC,
        ErrorLevel.WARNING
      );
    } finally {
      performanceMonitor.endMeasurement('handle_time_expired');
    }
  };

  const handleChoiceSelection = (choiceId: string) => {
    try {
      if (selectedChoice) return; // Prevent multiple selections
      setSelectedChoice(choiceId);
      
      performanceMonitor.startMeasurement('handle_choice_selection');
      
      const choice = currentEvent?.choices.find(c => c.id === choiceId);
      if (!choice) throw new Error(`Choice ${choiceId} not found`);

      // Apply effects
      Object.entries(choice.effects).forEach(([resource, value]) => {
        dispatch(modifyResource({ resource, delta: value }));
      });

      dispatch(makeChoice(choiceId));
    } catch (error) {
      errorHandler.handleError(
        error as Error,
        ErrorType.GAME_LOGIC,
        ErrorLevel.ERROR
      );
    } finally {
      performanceMonitor.endMeasurement('handle_choice_selection');
    }
  };

  if (!currentEvent) return null;

  const formatEffect = (value: number) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{currentEvent.title}</h2>
        <p className="text-gray-600">{currentEvent.description}</p>
        <div className="text-sm text-gray-500 mt-2">{timeLeft}s</div>
      </div>
      
      <div className="space-y-2">
        {currentEvent.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceSelection(choice.id)}
            disabled={!!selectedChoice}
            className={`w-full p-2 text-left hover:bg-gray-100 rounded transition-colors 
              ${selectedChoice === choice.id ? 'bg-blue-50' : ''}`}
            data-testid={`choice-${choice.id}`}
          >
            <div>{choice.text}</div>
            <div className="text-sm text-gray-500">
              {Object.entries(choice.effects).map(([resource, value]) => (
                <span key={resource} className="mr-2">
                  {resource === 'money' ? '$' : ''}{formatEffect(value)} {resource}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};