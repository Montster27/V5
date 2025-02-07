// src/store/slices/stressEnergySlice.ts

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { StressEnergyState, StressEnergyService } from '@/domain/services/StressEnergyService';

// Get initial state from persistence service
const stressEnergyService = StressEnergyService.getInstance();

interface StressEnergySliceState {
  state: StressEnergyState;
  isLoading: boolean;
  error: string | null;
}

const initialState: StressEnergySliceState = {
  state: {
    energy: 100,
    stress: 0,
    restHours: 8,
    activeHours: 0,
    studyHours: 0,
    workHours: 0,
    socialHours: 0,
    lastUpdate: Date.now()
  },
  isLoading: false,
  error: null
};

const stressEnergySlice = createSlice({
  name: 'stressEnergy',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateState: (state, action: PayloadAction<StressEnergyState>) => {
      state.state = action.payload;
    },
    updateEnergy: (state, action: PayloadAction<number>) => {
      state.state.energy = Math.max(0, Math.min(100, action.payload));
    },
    updateStress: (state, action: PayloadAction<number>) => {
      state.state.stress = Math.max(0, Math.min(100, action.payload));
    },
    addActivityHours: (state, action: PayloadAction<{
      activity: 'study' | 'work' | 'social' | 'rest';
      hours: number;
    }>) => {
      const { activity, hours } = action.payload;
      state.state[`${activity}Hours`] += hours;
      if (activity !== 'rest') {
        state.state.activeHours += hours;
      }
    },
    resetDailyHours: (state) => {
      state.state.activeHours = 0;
      state.state.studyHours = 0;
      state.state.workHours = 0;
      state.state.socialHours = 0;
      state.state.restHours = 0;
    }
  }
});

// Export actions
export const {
  setLoading,
  setError,
  updateState,
  updateEnergy,
  updateStress,
  addActivityHours,
  resetDailyHours
} = stressEnergySlice.actions;

// Selectors
export const selectStressEnergyState = (state: { stressEnergy: StressEnergySliceState }) => 
  state.stressEnergy.state;

export const selectIsLoading = (state: { stressEnergy: StressEnergySliceState }) => 
  state.stressEnergy.isLoading;

export const selectError = (state: { stressEnergy: StressEnergySliceState }) => 
  state.stressEnergy.error;

// Memoized selectors
export const selectEfficiencyModifiers = createSelector(
  [selectStressEnergyState],
  (state) => stressEnergyService.calculateEfficiencyModifiers(state)
);

export const selectStateWarnings = createSelector(
  [selectStressEnergyState],
  (state) => stressEnergyService.getStateWarnings(state)
);

// Thunks
export const updateStressEnergyState = (delta: number) => async (
  dispatch: any,
  getState: any
) => {
  try {
    dispatch(setLoading(true));
    const currentState = selectStressEnergyState(getState());
    const newState = await stressEnergyService.updateState(currentState, delta);
    dispatch(updateState(newState));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default stressEnergySlice.reducer;