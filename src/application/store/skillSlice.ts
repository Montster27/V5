import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SkillState {
  BODY: number;
  MIND: number;
  HEART: number;
  WORLD: number;
  MASTERY: number;
}

const initialState: SkillState = {
  BODY: 1,
  MIND: 1,
  HEART: 1,
  WORLD: 1,
  MASTERY: 1
};

export const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    increaseSkill: (
      state,
      action: PayloadAction<{ skill: keyof SkillState; amount: number }>
    ) => {
      const { skill, amount } = action.payload;
      state[skill] = Math.min(10, state[skill] + amount);
    },
    setSkill: (
      state,
      action: PayloadAction<{ skill: keyof SkillState; level: number }>
    ) => {
      const { skill, level } = action.payload;
      state[skill] = Math.max(1, Math.min(10, level));
    }
  }
});

export const { increaseSkill, setSkill } = skillSlice.actions;
export const skillReducer = skillSlice.reducer;