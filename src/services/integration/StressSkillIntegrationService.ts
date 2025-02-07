import { SkillState, LifeThread } from '../skills/types';
import { StressEnergyService } from '../StressEnergyService';
import { GameState } from '../types';

interface StressSkillModifiers {
  stressResistance: number;  // 0-1, reduces stress accumulation
  energyEfficiency: number;  // 0-1, reduces energy drain
  recoveryRate: number;      // 1+, multiplies recovery rate
}

export class StressSkillIntegrationService {
  private static readonly BASE_MODIFIER = 0.1; // 10% effect per skill level
  private static readonly MAX_MODIFIER = 0.5;  // Maximum 50% reduction
  private static readonly MIN_RECOVERY_RATE = 1.0;
  private static readonly MAX_RECOVERY_RATE = 2.0;
  private static readonly DEFAULT_XP_MODIFIER = 1.0;
  
  /**
   * Validates game state for required properties
   */
  private static validateGameState(state: GameState): void {
    if (!state) {
      throw new Error('Invalid game state provided');
    }
    
    if (typeof state.energy !== 'number' || typeof state.stress !== 'number') {
      throw new Error('Invalid energy or stress values in game state');
    }
    
    if (typeof state.restHours !== 'number') {
      throw new Error('Invalid rest hours in game state');
    }
  }

  /**
   * Validates skill state for required properties
   */
  private static validateSkillState(state: SkillState): void {
    if (!state) {
      throw new Error('Invalid skill state provided');
    }

    if (!state.threadLevels) {
      throw new Error('Invalid thread levels in skill state');
    }
  }

  /**
   * Safely gets a thread level with validation
   */
  private static getThreadLevel(state: SkillState, thread: LifeThread): number {
    try {
      const level = state.threadLevels[thread];
      return Math.max(0, Number(level) || 0);
    } catch (error) {
      console.error(`Error getting thread level for ${thread}:`, error);
      return 0;
    }
  }

  /**
   * Calculates modifiers based on relevant skill levels with error handling
   */
  static calculateModifiers(skillState: SkillState): StressSkillModifiers {
    this.validateSkillState(skillState);

    try {
      const bodyLevel = this.getThreadLevel(skillState, LifeThread.BODY);
      const mindLevel = this.getThreadLevel(skillState, LifeThread.MIND);
      const heartLevel = this.getThreadLevel(skillState, LifeThread.HEART);

      // Calculate individual modifiers with safety checks
      const stressResistance = Math.min(
        this.MAX_MODIFIER,
        Math.max(0, (mindLevel + heartLevel) * this.BASE_MODIFIER)
      );

      const energyEfficiency = Math.min(
        this.MAX_MODIFIER,
        Math.max(0, (bodyLevel + mindLevel) * this.BASE_MODIFIER)
      );

      const recoveryRate = Math.min(
        this.MAX_RECOVERY_RATE,
        Math.max(
          this.MIN_RECOVERY_RATE,
          1 + (bodyLevel * this.BASE_MODIFIER)
        )
      );

      return {
        stressResistance,
        energyEfficiency,
        recoveryRate
      };
    } catch (error) {
      console.error('Error calculating modifiers:', error);
      return {
        stressResistance: 0,
        energyEfficiency: 0,
        recoveryRate: this.MIN_RECOVERY_RATE
      };
    }
  }

  /**
   * Applies skill-based modifiers to stress increase with validation
   */
  static modifyStressIncrease(
    state: GameState,
    skillState: SkillState,
    baseStressIncrease: number
  ): number {
    try {
      const { stressResistance } = this.calculateModifiers(skillState);
      const modifiedStress = baseStressIncrease * (1 - stressResistance);
      return Math.max(0, Number.isFinite(modifiedStress) ? modifiedStress : baseStressIncrease);
    } catch (error) {
      console.error('Error modifying stress increase:', error);
      return Math.max(0, baseStressIncrease);
    }
  }

  /**
   * Applies skill-based modifiers to energy drain with validation
   */
  static modifyEnergyDrain(
    state: GameState,
    skillState: SkillState,
    baseEnergyDrain: number
  ): number {
    try {
      const { energyEfficiency } = this.calculateModifiers(skillState);
      const modifiedDrain = baseEnergyDrain * (1 - energyEfficiency);
      return Math.max(0, Number.isFinite(modifiedDrain) ? modifiedDrain : baseEnergyDrain);
    } catch (error) {
      console.error('Error modifying energy drain:', error);
      return Math.max(0, baseEnergyDrain);
    }
  }

  /**
   * Calculates recovery rates based on skills with validation
   */
  static calculateRecoveryRates(
    state: GameState,
    skillState: SkillState
  ): { energyRecovery: number; stressRecovery: number } {
    try {
      const { recoveryRate } = this.calculateModifiers(skillState);
      
      return {
        energyRecovery: Math.max(0, 5 * recoveryRate),
        stressRecovery: Math.max(0, 3 * recoveryRate)
      };
    } catch (error) {
      console.error('Error calculating recovery rates:', error);
      return {
        energyRecovery: 5,
        stressRecovery: 3
      };
    }
  }

  /**
   * Updates state with skill modifiers and validates delta
   */
  static updateStateWithSkills(
    state: GameState,
    skillState: SkillState,
    delta: number
  ): GameState {
    this.validateGameState(state);
    this.validateSkillState(skillState);

    if (delta <= 0) {
      throw new Error('Delta value must be positive');
    }

    try {
      // Calculate base changes
      const baseEnergyDrain = StressEnergyService.calculateEnergyDrain(state, delta);
      const baseStressIncrease = StressEnergyService.calculateStressIncrease(state, delta);

      // Apply skill modifiers
      const modifiedEnergyDrain = this.modifyEnergyDrain(state, skillState, baseEnergyDrain);
      const modifiedStressIncrease = this.modifyStressIncrease(state, skillState, baseStressIncrease);

      // Calculate recovery with bounds checking
      const { energyRecovery, stressRecovery } = this.calculateRecoveryRates(state, skillState);
      const recoveryMultiplier = Math.max(0, Math.min(24, state.restHours)) * delta;

      // Update state with bounds checking
      return {
        ...state,
        energy: Math.max(0, Math.min(100, 
          state.energy - modifiedEnergyDrain + (energyRecovery * recoveryMultiplier)
        )),
        stress: Math.max(0, Math.min(100,
          state.stress + modifiedStressIncrease - (stressRecovery * recoveryMultiplier)
        ))
      };
    } catch (error) {
      console.error('Error updating state with skills:', error);
      return state;
    }
  }

  /**
   * Calculates XP modifier based on state with validation
   */
  static calculateXPModifier(state: GameState): number {
    try {
      this.validateGameState(state);

      const boundedEnergy = Math.min(100, Math.max(0, state.energy));
      const boundedStress = Math.min(100, Math.max(0, state.stress));

      const energyBonus = boundedEnergy > 80 ? 0.2 : 0;
      const stressPenalty = boundedStress > 70 ? -0.3 : 0;

      const modifier = 1 + energyBonus + stressPenalty;
      return Number.isFinite(modifier) ? modifier : this.DEFAULT_XP_MODIFIER;
    } catch (error) {
      console.error('Error calculating XP modifier:', error);
      return this.DEFAULT_XP_MODIFIER;
    }
  }
}