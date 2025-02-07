import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface EventState {
  current: Event | null;
  history: Array<Event & { choiceMade: string }>;
}

const initialState: EventState = {
  current: null,
  history: []
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.current = action.payload;
    },
    makeChoice: (state, action: PayloadAction<string>) => {
      if (state.current) {
        state.history.push({
          ...state.current,
          choiceMade: action.payload
        });
        state.current = null;
      }
    },
    clearEvent: (state) => {
      state.current = null;
    }
  }
});

export const { setCurrentEvent, makeChoice, clearEvent } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;