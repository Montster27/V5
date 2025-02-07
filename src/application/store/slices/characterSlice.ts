import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  CharacterState, 
  INITIAL_CHARACTER_STATE, 
  StatusEffect, 
  Skill,
  Major
} from '../../../domain/character/types';

interface SkillUpdate {
  skill: Skill;
  amount: number;
}

interface StatusEffectUpdate {
  type: StatusEffect;
  duration: number;
  magnitude: number;
}

interface GradeUpdate {
  courseId: string;
  grade: number;
}

export const characterSlice = createSlice({
  name: 'character',
  initialState: INITIAL_CHARACTER_STATE,
  reducers: {
    initializeCharacter: (state, action: PayloadAction<{name: string; major: Major}>) => {
      state.name = action.payload.name;
      state.major = action.payload.major;
    },

    updateSkill: (state, action: PayloadAction<SkillUpdate>) => {
      const { skill, amount } = action.payload;
      state.skills[skill] = Math.max(0, Math.min(100, state.skills[skill] + amount));
    },

    addStatusEffect: (state, action: PayloadAction<StatusEffectUpdate>) => {
      const { type, duration, magnitude } = action.payload;
      state.activeEffects[type] = { type, duration, magnitude };
      
      // Update derived states based on effects
      state.isStressed = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.STRESSED || 
                 effect.type === StatusEffect.OVERWHELMED ||
                 effect.type === StatusEffect.BURNED_OUT
      );
      
      state.isRested = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.WELL_RESTED ||
                 effect.type === StatusEffect.ENERGIZED
      );
    },

    removeStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      delete state.activeEffects[action.payload];
      
      // Update derived states
      state.isStressed = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.STRESSED || 
                 effect.type === StatusEffect.OVERWHELMED ||
                 effect.type === StatusEffect.BURNED_OUT
      );
      
      state.isRested = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.WELL_RESTED ||
                 effect.type === StatusEffect.ENERGIZED
      );
    },

    updateEffectDurations: (state) => {
      for (const [effectType, effect] of Object.entries(state.activeEffects)) {
        effect.duration--;
        if (effect.duration <= 0) {
          delete state.activeEffects[effectType];
        }
      }
      
      // Update derived states
      state.isStressed = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.STRESSED || 
                 effect.type === StatusEffect.OVERWHELMED ||
                 effect.type === StatusEffect.BURNED_OUT
      );
      
      state.isRested = Object.values(state.activeEffects).some(
        effect => effect.type === StatusEffect.WELL_RESTED ||
                 effect.type === StatusEffect.ENERGIZED
      );
    },

    enrollInCourse: (state, action: PayloadAction<string>) => {
      if (!state.currentCourses.includes(action.payload)) {
        state.currentCourses.push(action.payload);
      }
    },

    updateGrade: (state, action: PayloadAction<GradeUpdate>) => {
      // This is a simplified GPA calculation - would need to be expanded
      // based on credit hours and proper GPA calculation rules
      const currentTotalPoints = state.gpa * state.creditsCompleted;
      const newPoints = currentTotalPoints + action.payload.grade;
      state.creditsCompleted += 1;
      state.gpa = newPoints / state.creditsCompleted;
    },

    levelUpAttribute: (state, action: PayloadAction<keyof CharacterState['attributes']>) => {
      const attribute = action.payload;
      if (state.attributes[attribute] < 100) {
        state.attributes[attribute] += 1;
      }
    }
  }
});