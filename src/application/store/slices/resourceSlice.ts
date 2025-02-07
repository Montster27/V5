import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceState, EventChoice, TimeState } from '../../../domain/types/gameState';

const initialResourceState: ResourceState = {
  money: 1000,
  energy: 100,
  stress: 0,
  knowledge: {
    academic: 0,
    social: 0,
    practical: 0,
  },
  social: {
    popularity: 0,
    connections: 0,
  },
};

export const resourceSlice = createSlice({
  name: 'resources',
  initialState: initialResourceState,
  reducers: {
    updateResources: (state, action: PayloadAction<Partial<ResourceState>>) => {
      return { ...state, ...action.payload };
    },
    applyEventEffect: (state, action: PayloadAction<EventChoice['consequences']['resources']>) => {
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (key in state) {
            (state as any)[key] += value;
          }
        });
      }
    },
    applyHourlyUpdate: (state, action: PayloadAction<{activity: keyof TimeState['allocatedHours']}>) => {
      // Apply hourly effects based on current activity
      switch (action.payload.activity) {
        case 'study':
          state.energy -= 5;
          state.stress += 2;
          state.knowledge.academic += 1;
          break;
        case 'sleep':
          state.energy = Math.min(state.energy + 10, 100);
          state.stress = Math.max(state.stress - 5, 0);
          break;
        case 'social':
          state.energy -= 3;
          state.stress -= 2;
          state.social.popularity += 1;
          break;
        case 'work':
          state.energy -= 4;
          state.money += 15;
          state.knowledge.practical += 0.5;
          break;
        case 'leisure':
          state.energy -= 2;
          state.stress -= 3;
          break;
      }
      
      // Ensure values stay within bounds
      state.energy = Math.max(0, Math.min(state.energy, 100));
      state.stress = Math.max(0, Math.min(state.stress, 100));
    },
  },
});