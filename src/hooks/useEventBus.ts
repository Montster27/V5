import { useEffect } from 'react';
import { eventBus, TimeEvent, ResourceEvent, StateEvent } from '../infrastructure/events/EventBus';

type EventMap = {
  'DAY_PASSED': TimeEvent;
  'WEEK_PASSED': TimeEvent;
  'MONTH_PASSED': TimeEvent;
  'RESOURCE_CHANGED': ResourceEvent;
  'STATE_CHANGED': StateEvent;
};

export function useEventBus<K extends keyof EventMap>(
  eventType: K,
  handler: (event: EventMap[K]) => void
) {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(eventType, handler);
    return () => unsubscribe();
  }, [eventType, handler]);

  return {
    publish: (event: EventMap[K]) => eventBus.publish(eventType, event)
  };
}