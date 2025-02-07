import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDisplayProps } from '../types/events';

interface EventState {
  currentEvent: EventDisplayProps | null;
  eventHistory: string[]; // IDs of past events
}

const initialState: EventState = {
  currentEvent: null,
  eventHistory: [],
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<EventDisplayProps | null>) => {
      if (state.currentEvent && action.payload) {
        state.eventHistory.push(state.currentEvent.id);
      }
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      if (state.currentEvent) {
        state.eventHistory.push(state.currentEvent.id);
      }
      state.currentEvent = null;
    },
    resetEvents: () => initialState,
  },
});

export const { setCurrentEvent, clearCurrentEvent, resetEvents } = eventSlice.actions;
export default eventSlice.reducer;