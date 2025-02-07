import { StressEnergyService } from '../services/StressEnergyService';
import { SkillService } from '../services/SkillService';
import { errorHandler } from '../../infrastructure/error/ErrorHandler';

export class StressSkillIntegrationService {
  constructor(
    private stressEnergyService: StressEnergyService,
    private skillService: SkillService
  ) {}

  calculateSkillEffectiveness(skillName: string): number {
    try {
      const energy = this.stressEnergyService.getEnergy();
      const stress = this.stressEnergyService.getStress();
      const skillLevel = this.skillService.getSkillLevel(skillName);

      // Base effectiveness from skill level (0.5 to 1.5)
      const skillFactor = 0.5 + (skillLevel / 10);

      // Energy factor (0.3 to 1.0)
      const energyFactor = 0.3 + (energy / 100 * 0.7);

      // Stress penalty (0.5 to 1.0)
      const stressFactor = 1 - (stress / 100 * 0.5);

      return skillFactor * energyFactor * stressFactor;
    } catch (error) {
      errorHandler.handleError(error as Error);
      return 0.5; // Default effectiveness on error
    }
  }

  applySkillUsage(skillName: string, activity: string): void {
    try {
      // Validate inputs
      if (!this.isValidActivity(activity)) {
        errorHandler.handleError(new Error(`Invalid activity: ${activity}`));
        return;
      }

      // Apply energy cost
      const energyCost = this.getActivityEnergyCost(activity);
      this.stressEnergyService.updateEnergy(-energyCost);

      // Apply stress change
      const stressChange = this.getActivityStressChange(activity);
      this.stressEnergyService.updateStress(stressChange);

      // Potentially increase skill
      if (Math.random() < this.calculateSkillGainChance(skillName)) {
        this.skillService.increaseSkill(skillName);
      }
    } catch (error) {
      errorHandler.handleError(error as Error);
    }
  }

  applyRecovery(type: string): void {
    try {
      const validTypes = ['rest', 'meditation', 'exercise', 'social'];
      if (!validTypes.includes(type)) {
        errorHandler.handleError(new Error(`Invalid recovery type: ${type}`));
        return;
      }

      switch (type) {
        case 'rest':
          this.stressEnergyService.updateEnergy(30);
          this.stressEnergyService.updateStress(-10);
          break;
        case 'meditation':
          this.stressEnergyService.updateEnergy(10);
          this.stressEnergyService.updateStress(-20);
          break;
        case 'exercise':
          this.stressEnergyService.updateEnergy(-5);
          this.stressEnergyService.updateStress(-15);
          break;
        case 'social':
          this.stressEnergyService.updateEnergy(-10);
          this.stressEnergyService.updateStress(-10);
          break;
      }
    } catch (error) {
      errorHandler.handleError(error as Error);
    }
  }

  private isValidActivity(activity: string): boolean {
    const validActivities = ['intense_workout', 'study_session', 'social_event'];
    return validActivities.includes(activity) || activity === 'default';
  }

  private getActivityEnergyCost(activity: string): number {
    const costs: Record<string, number> = {
      'intense_workout': 30,
      'study_session': 20,
      'social_event': 15,
      'default': 10
    };
    return costs[activity] ?? costs['default'];
  }

  private getActivityStressChange(activity: string): number {
    const changes: Record<string, number> = {
      'intense_workout': 5, // Changed to increase stress during workout
      'study_session': 15,
      'social_event': -5,  // Social events reduce stress
      'default': 0
    };
    return changes[activity] ?? changes['default'];
  }

  private calculateSkillGainChance(skillName: string): number {
    const currentLevel = this.skillService.getSkillLevel(skillName);
    // Harder to gain skills at higher levels
    return 0.5 / (currentLevel * 0.5);
  }
}