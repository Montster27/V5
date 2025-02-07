import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResourceState {
  money: number;
  social: number;
  knowledge: number;
  energy: number;
  stress: number;
}

const initialState: ResourceState = {
  money: 1000,
  social: 50,
  knowledge: 30,
  energy: 100,
  stress: 0
};

export const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    updateResource: (
      state,
      action: PayloadAction<{ resource: keyof ResourceState; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource] = value;
    },
    modifyResource: (
      state,
      action: PayloadAction<{ resource: keyof ResourceState; delta: number }>
    ) => {
      const { resource, delta } = action.payload;
      state[resource] += delta;
    }
  }
});

export const { updateResource, modifyResource } = resourceSlice.actions;
export const resourceReducer = resourceSlice.reducer;