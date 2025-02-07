// src/hooks/useEventBus.ts

import { useEffect, useCallback, useRef } from 'react';
import { EventBus } from '@/infrastructure/events/EventBus';
import type { GameEvent, EventCallback } from '@/domain/events/types';

export function useEventBus() {
  const eventBus = useRef(EventBus.getInstance());
  
  // Memoized dispatch function
  const dispatch = useCallback((event: Omit<GameEvent, 'timestamp'>) => {
    eventBus.current.dispatch({
      ...event,
      timestamp: Date.now()
    });
  }, []);

  // Hook for subscribing to events
  const useEventSubscription = (
    eventType: string,
    callback: EventCallback,
    deps: any[] = []
  ) => {
    useEffect(() => {
      const unsubscribe = eventBus.current.subscribe(eventType, callback);
      return () => {
        unsubscribe();
      };
    }, [eventType, ...deps]);
  };

  return {
    dispatch,
    useEventSubscription,
    // Expose raw subscribe for advanced use cases
    subscribe: useCallback((eventType: string, callback: EventCallback) => 
      eventBus.current.subscribe(eventType, callback),
    [])
  };
}

// Helper hook for simple event subscriptions
export function useGameEvent(
  eventType: string,
  callback: EventCallback,
  deps: any[] = []
) {
  const { useEventSubscription } = useEventBus();
  useEventSubscription(eventType, callback, deps);
}