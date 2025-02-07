// /Users/montysharma/Documents/V5/mmv_clean/src/domain/shared/StressEnergyService.ts

import { StressEnergyState, StressEnergyModifiers, ActivityImpact } from './StressEnergyTypes';

export class StressEnergyService {
  private static readonly MIN_EFFICIENCY = 0.1;  // 10% minimum efficiency
  private static readonly ENERGY_BASE_DRAIN = -5;  // Base energy drain per active hour
  private static readonly REST_DEFICIT_PENALTY = -3;  // Energy penalty per missing rest hour
  private static readonly OVEREXERTION_PENALTY = -10;  // Energy penalty for over 12 active hours

  /**
   * Calculate energy drain based on activity hours and rest
   */
  static calculateEnergyDrain(state: StressEnergyState, delta: number): number {
    const restDeficit = Math.max(0, 8 - state.restHours);  // Deficit from 8 hours ideal rest
    const overexertionPenalty = state.activeHours > 12 ? this.OVEREXERTION_PENALTY : 0;

    return (
      (this.ENERGY_BASE_DRAIN * state.activeHours) +
      (this.REST_DEFICIT_PENALTY * restDeficit) +
      overexertionPenalty
    ) * delta;
  }

  /**
   * Calculate stress increase based on various factors
   */
  static calculateStressIncrease(state: StressEnergyState, delta: number): number {
    const studyStress = state.studyHours > 6 ? (state.studyHours - 6) * 2 : 0;
    const workStress = state.workHours > 8 ? (state.workHours - 8) * 2 : 0;
    const socialStress = state.socialHours < 2 ? 5 : 0;
    const restStress = state.restHours < 6 ? (6 - state.restHours) * 3 : 0;

    return (studyStress + workStress + socialStress + restStress) * delta;
  }

  /**
   * Calculate efficiency modifiers based on current stress and energy levels
   */
  static calculateEfficiencyModifiers(state: StressEnergyState): StressEnergyModifiers {
    const baseEfficiency = (1 - state.stress / 200) * (state.energy / 100);
    const efficiency = Math.max(this.MIN_EFFICIENCY, baseEfficiency);

    return {
      energyModifier: efficiency,
      stressModifier: efficiency
    };
  }

  /**
   * Calculate impact of an activity on stress and energy
   */
  static calculateActivityImpact(
    currentState: StressEnergyState,
    hours: number,
    delta: number
  ): ActivityImpact {
    const stateWithActivity: StressEnergyState = {
      ...currentState,
      activeHours: currentState.activeHours + hours
    };

    return {
      energyDrain: this.calculateEnergyDrain(stateWithActivity, delta),
      stressIncrease: this.calculateStressIncrease(stateWithActivity, delta)
    };
  }

  /**
   * Update state based on current values and delta time
   */
  static updateState(state: StressEnergyState, delta: number): StressEnergyState {
    const energyDrain = this.calculateEnergyDrain(state, delta);
    const stressIncrease = this.calculateStressIncrease(state, delta);

    return {
      ...state,
      energy: Math.max(0, Math.min(100, state.energy + energyDrain)),
      stress: Math.max(0, Math.min(100, state.stress + stressIncrease))
    };
  }
}