import { store } from '../../store';
import { GameState } from '../types';
import { Activity } from '../activities/types';
import { ActivitySkillEffect } from './types';
import { addExperience } from './skillsSlice';
import { StressSkillIntegrationService } from '../integration/StressSkillIntegrationService';

export class ActivitySkillService {
  static processActivityEffects(
    state: GameState,
    activity: Activity,
    effects: ActivitySkillEffect[]
  ): void {
    const { energy, stress } = state;
    const skillState = store.getState().skills;
    
    effects.forEach(effect => {
      const { skillId, xpGain, conditions } = effect;
      
      // Check conditions
      if (conditions) {
        if (conditions.minEnergy && energy < conditions.minEnergy) return;
        if (conditions.maxStress && stress > conditions.maxStress) return;
      }
      
      // Calculate XP modifier based on current state
      const xpModifier = StressSkillIntegrationService.calculateXPModifier(state);
      const modifiedXP = Math.floor(xpGain * xpModifier);
      
      // Apply XP gain
      store.dispatch(addExperience({
        nodeId: skillId,
        amount: modifiedXP
      }));
    });
  }

  /**
   * Returns skill requirements and recommendations for an activity
   */
  static getActivitySkillRequirements(
    activity: Activity,
    state: GameState
  ): {
    required: { skillId: string; level: number }[];
    recommended: { skillId: string; level: number }[];
  } {
    // This would be populated based on activity configuration
    return {
      required: [],
      recommended: []
    };
  }

  /**
   * Checks if the player meets skill requirements for an activity
   */
  static meetsSkillRequirements(
    activity: Activity,
    state: GameState
  ): boolean {
    const skillState = store.getState().skills;
    const { required } = this.getActivitySkillRequirements(activity, state);

    return required.every(req => {
      const node = skillState.nodes[req.skillId];
      return node && node.level >= req.level;
    });
  }
}