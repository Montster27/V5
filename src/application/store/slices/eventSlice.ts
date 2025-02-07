import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  EventState, 
  GameEvent, 
  EventChoice,
  isEventAvailable,
  EventTriggerState
} from '../../../domain/events/types';

const initialState: EventState = {
  activeEvent: null,
  eventQueue: [],
  completedEvents: [],
  availableEvents: [],
  eventHistory: []
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setActiveEvent: (state, action: PayloadAction<GameEvent | null>) => {
      state.activeEvent = action.payload;
      if (action.payload) {
        // Remove from queue if it was there
        state.eventQueue = state.eventQueue.filter(e => e.id !== action.payload?.id);
      }
    },

    addToQueue: (state, action: PayloadAction<GameEvent>) => {
      // Don't add if already in queue or is active
      if (!state.eventQueue.find(e => e.id === action.payload.id) && 
          (!state.activeEvent || state.activeEvent.id !== action.payload.id)) {
        state.eventQueue.push(action.payload);
        // Sort by priority
        state.eventQueue.sort((a, b) => b.priority - a.priority);
      }
    },

    updateAvailableEvents: (state, action: PayloadAction<{
      events: GameEvent[];
      triggerState: EventTriggerState;
    }>) => {
      state.availableEvents = action.payload.events.filter(
        event => isEventAvailable(event, action.payload.triggerState)
      );
    },

    completeEvent: (state, action: PayloadAction<{
      eventId: string;
      choiceId: string;
    }>) => {
      const { eventId, choiceId } = action.payload;
      
      // Add to completed events if not already there
      if (!state.completedEvents.includes(eventId)) {
        state.completedEvents.push(eventId);
      }

      // Add to history
      state.eventHistory.push({
        eventId,
        choiceId,
        timestamp: Date.now()
      });

      // Clear active event if it was this one
      if (state.activeEvent?.id === eventId) {
        state.activeEvent = null;
      }

      // Update last occurrence for repeatable events
      const availableEvent = state.availableEvents.find(e => e.id === eventId);
      if (availableEvent && availableEvent.repeatable) {
        availableEvent.lastOccurrence = Date.now();
      }
    },

    clearExpiredEvents: (state, action: PayloadAction<number>) => {
      const currentHour = action.payload;
      state.eventQueue = state.eventQueue.filter(event => {
        if (!event.expiresAfter) return true;
        const expirationHour = (event.lastOccurrence || 0) + event.expiresAfter;
        return currentHour < expirationHour;
      });
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.eventQueue = state.eventQueue.filter(e => e.id !== action.payload);
    }
  }
});