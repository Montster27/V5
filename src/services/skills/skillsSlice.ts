import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SkillState } from './types';
import { SkillSystemService } from './SkillSystemService';

const skillsSlice = createSlice({
  name: 'skills',
  initialState: SkillSystemService.initializeSkillWeb(),
  reducers: {
    addExperience(state, action: PayloadAction<{nodeId: string, amount: number}>) {
      return SkillSystemService.addXP(state, action.payload.nodeId, action.payload.amount);
    },
    applyDecay(state) {
      return SkillSystemService.applySkillDecay(state);
    },
    unlockSkill(state, action: PayloadAction<string>) {
      return SkillSystemService.unlockNode(state, action.payload);
    }
  }
});

export const { addExperience, applyDecay, unlockSkill } = skillsSlice.actions;
export default skillsSlice.reducer;