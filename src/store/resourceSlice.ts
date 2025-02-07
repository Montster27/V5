import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceDisplayProps } from '../types/game';

const initialState: ResourceDisplayProps = {
  money: 1000,
  knowledge: 0,
  socialPoints: 0,
  energy: 100,
  stress: 0,
};

export const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    updateResources: (state, action: PayloadAction<Partial<ResourceDisplayProps>>) => {
      return { ...state, ...action.payload };
    },
    modifyResources: (state, action: PayloadAction<Partial<ResourceDisplayProps>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key in state && typeof value === 'number') {
          state[key as keyof ResourceDisplayProps] += value;
        }
      });
    },
    resetResources: () => initialState,
  },
});

export const { updateResources, modifyResources, resetResources } = resourceSlice.actions;
export default resourceSlice.reducer;