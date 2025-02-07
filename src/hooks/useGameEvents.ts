// /Users/montysharma/Documents/V5/mmv_clean/src/hooks/useGameEvents.ts

import { useState, useCallback, useEffect } from 'react';
import { EventService } from '../domain/events/EventService';
import { GameEvent } from '../domain/events/EventTypes';
import { useGameLoop } from './useGameLoop';

export const useGameEvents = () => {
  const [eventService] = useState(() => new EventService());
  const [events, setEvents] = useState<GameEvent[]>([]);
  const { delta } = useGameLoop();

  // Update events list periodically
  useEffect(() => {
    if (delta > 0) {
      setEvents(eventService.getRecentEvents());
    }
  }, [delta, eventService]);

  const addActivityEvent = useCallback(
    (
      activityType: 'rest' | 'study' | 'work' | 'social',
      duration: number,
      energyImpact: number,
      stressImpact: number
    ) => {
      eventService.addActivityEvent(activityType, duration, energyImpact, stressImpact);
      setEvents(eventService.getRecentEvents());
    },
    [eventService]
  );

  const addStatusChangeEvent = useCallback(
    (
      statusType: 'energy' | 'stress',
      oldValue: number,
      newValue: number,
      reason: string
    ) => {
      eventService.addStatusChangeEvent(statusType, oldValue, newValue, reason);
      setEvents(eventService.getRecentEvents());
    },
    [eventService]
  );

  const addMilestoneEvent = useCallback(
    (milestoneType: string, achievement: string) => {
      eventService.addMilestoneEvent(milestoneType, achievement);
      setEvents(eventService.getRecentEvents());
    },
    [eventService]
  );

  const clearEvents = useCallback(() => {
    eventService.clearEvents();
    setEvents([]);
  }, [eventService]);

  return {
    events,
    addActivityEvent,
    addStatusChangeEvent,
    addMilestoneEvent,
    clearEvents
  };
};