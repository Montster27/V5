interface GameState {
  studyHours: number;
  workHours: number;
  socialHours: number;
  restHours: number;
  energy: number;
  stress: number;
}

interface EfficiencyModifiers {
  energyModifier: number;
  stressModifier: number;
}

export class StressEnergyService {
  static readonly MIN_EFFICIENCY = 0.1;
  static readonly ENERGY_DRAIN_PER_HOUR = 5;
  static readonly REST_DEFICIT_PENALTY = 3;
  static readonly OVEREXERTION_PENALTY = 10;
  static readonly MAX_ACTIVE_HOURS = 12;
  static readonly SOCIAL_STRESS_THRESHOLD = 2;
  static readonly MIN_REST_HOURS = 6;
  static readonly MAX_STUDY_HOURS = 6;
  static readonly MAX_WORK_HOURS = 8;

  static calculateEnergyDrain(state: GameState, delta: number): number {
    const activeHours = state.studyHours + state.workHours;
    const restDeficit = Math.max(0, 8 - state.restHours);
    const overexertion = activeHours > this.MAX_ACTIVE_HOURS ? this.OVEREXERTION_PENALTY : 0;

    return (
      (activeHours * this.ENERGY_DRAIN_PER_HOUR +
      restDeficit * this.REST_DEFICIT_PENALTY +
      overexertion) * delta
    );
  }

  static calculateStressIncrease(state: GameState, delta: number): number {
    let stress = 0;

    // Social stress - if below threshold
    if (state.socialHours < this.SOCIAL_STRESS_THRESHOLD) {
      stress += 5;
    }

    // Study stress - for hours beyond maximum
    if (state.studyHours > this.MAX_STUDY_HOURS) {
      stress += (state.studyHours - this.MAX_STUDY_HOURS) * 2;
    }

    // Work stress - for hours beyond maximum
    if (state.workHours > this.MAX_WORK_HOURS) {
      stress += (state.workHours - this.MAX_WORK_HOURS) * 2;
    }

    // Rest deficit stress
    if (state.restHours < this.MIN_REST_HOURS) {
      stress += (this.MIN_REST_HOURS - state.restHours) * 3;
    }

    return stress * delta;
  }

  static calculateEfficiencyModifiers(state: GameState): EfficiencyModifiers {
    // Using the specified formula: (1 - stress/200) * (energy/100)
    const efficiency = (1 - state.stress/200) * (state.energy/100);
    const adjustedEfficiency = Math.max(this.MIN_EFFICIENCY, efficiency);
    
    return {
      energyModifier: adjustedEfficiency,
      stressModifier: adjustedEfficiency,
    };
  }

  static updateState(state: GameState, delta: number): GameState {
    const energyDrain = this.calculateEnergyDrain(state, delta);
    const stressIncrease = this.calculateStressIncrease(state, delta);

    return {
      ...state,
      energy: Math.max(0, Math.min(100, state.energy - energyDrain)),
      stress: Math.max(0, Math.min(100, state.stress + stressIncrease)),
    };
  }

  /**
   * Helper method to check if the current state is sustainable
   * Returns warnings about potential issues
   */
  static checkStateWarnings(state: GameState): string[] {
    const warnings: string[] = [];

    if (state.restHours < this.MIN_REST_HOURS) {
      warnings.push(`Rest hours (${state.restHours}) below minimum ${this.MIN_REST_HOURS}`);
    }

    if (state.socialHours < this.SOCIAL_STRESS_THRESHOLD) {
      warnings.push(`Social hours (${state.socialHours}) below stress threshold ${this.SOCIAL_STRESS_THRESHOLD}`);
    }

    const activeHours = state.studyHours + state.workHours;
    if (activeHours > this.MAX_ACTIVE_HOURS) {
      warnings.push(`Active hours (${activeHours}) exceed maximum ${this.MAX_ACTIVE_HOURS}`);
    }

    if (state.studyHours > this.MAX_STUDY_HOURS) {
      warnings.push(`Study hours (${state.studyHours}) exceed efficient maximum ${this.MAX_STUDY_HOURS}`);
    }

    if (state.workHours > this.MAX_WORK_HOURS) {
      warnings.push(`Work hours (${state.workHours}) exceed efficient maximum ${this.MAX_WORK_HOURS}`);
    }

    return warnings;
  }
}