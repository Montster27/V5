import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../../../domain/types/gameState';

const initialTimeState: TimeState = {
  currentDay: 1,
  currentHour: 8, // Start at 8 AM
  allocatedHours: {
    study: 8,
    sleep: 8,
    social: 2,
    work: 4,
    leisure: 2,
  },
};

export const timeSlice = createSlice({
  name: 'time',
  initialState: initialTimeState,
  reducers: {
    advanceTime: (state) => {
      state.currentHour += 1;
      if (state.currentHour >= 24) {
        state.currentHour = 0;
        state.currentDay += 1;
      }
    },
    allocateHours: (state, action: PayloadAction<Partial<TimeState['allocatedHours']>>) => {
      // Ensure total hours don't exceed 24
      const currentTotal = Object.values(state.allocatedHours).reduce((a, b) => a + b, 0);
      const newValues = { ...state.allocatedHours, ...action.payload };
      const newTotal = Object.values(newValues).reduce((a, b) => a + b, 0);
      
      if (newTotal <= 24 && newValues.sleep >= 1 && newValues.study <= 20) {
        state.allocatedHours = newValues;
      }
    },
    resetDay: (state) => {
      state.currentHour = 8;
    },
  },
});