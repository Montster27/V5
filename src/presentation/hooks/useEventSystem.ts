import { useState, useEffect } from 'react';
import { GameEvent, EventChoice } from '../../domain/events/types';
import { EventManager } from '../../application/events/EventManager';
import { useEventBus } from './useEventBus';

export const useEventSystem = (eventManager: EventManager) => {
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);
  const eventBus = useEventBus();

  useEffect(() => {
    const handleEventsAvailable = (events: GameEvent[]) => {
      setActiveEvents(events);
    };

    const handleEventProcessed = ({ eventId }: { eventId: string }) => {
      setActiveEvents(prev => prev.filter(event => event.id !== eventId));
    };

    eventBus.subscribe('events:available', handleEventsAvailable);
    eventBus.subscribe('events:choice:processed', handleEventProcessed);

    return () => {
      eventBus.unsubscribe('events:available', handleEventsAvailable);
      eventBus.unsubscribe('events:choice:processed', handleEventProcessed);
    };
  }, [eventBus]);

  const handleChoice = (event: GameEvent, choice: EventChoice) => {
    eventManager.handleEventChoice(event, choice);
  };

  return {
    activeEvents,
    handleChoice
  };
};