// /Users/montysharma/Documents/V5/mmv_clean/src/domain/shared/StressEnergyTypes.ts

export interface StressEnergyState {
  energy: number;        // 0-100
  stress: number;        // 0-100
  restHours: number;     // Hours of rest in current period
  activeHours: number;   // Hours of active tasks in current period
  studyHours: number;    // Hours of study in current period
  workHours: number;     // Hours of work in current period
  socialHours: number;   // Hours of social activity in current period
}

export interface StressEnergyModifiers {
  energyModifier: number;  // 0-1 energy efficiency multiplier
  stressModifier: number;  // 0-1 stress impact multiplier
}

export interface ActivityImpact {
  energyDrain: number;
  stressIncrease: number;
}