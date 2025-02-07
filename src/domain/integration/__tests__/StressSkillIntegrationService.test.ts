// src/domain/integration/__tests__/StressSkillIntegrationService.test.ts

import { StressSkillIntegrationService } from '../StressSkillIntegrationService';
import { LifeThread, SkillState } from '../../skills/types';
import { StressEnergyState } from '../../services/StressEnergyService';

describe('StressSkillIntegrationService', () => {
  let service: StressSkillIntegrationService;

  const defaultSkillState: SkillState = {
    threadLevels: {
      [LifeThread.BODY]: 1,
      [LifeThread.MIND]: 1,
      [LifeThread.HEART]: 1,
      [LifeThread.WORLD]: 1,
      [LifeThread.MASTERY]: 1
    },
    skillLevels: {},
    experience: {},
    activeEffects: []
  };

  const defaultStressState: StressEnergyState = {
    energy: 100,
    stress: 0,
    restHours: 8,
    activeHours: 0,
    studyHours: 0,
    workHours: 0,
    socialHours: 2,
    lastUpdate: Date.now()
  };

  beforeEach(() => {
    service = StressSkillIntegrationService.getInstance();
  });

  describe('calculateModifiers', () => {
    it('should return base modifiers with no stress or skill effects', () => {
      const result = service.calculateModifiers(
        defaultStressState,
        defaultSkillState
      );

      // Should have 20% bonus from full energy
      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(1.2, 2);
      expect(result.threadModifiers[LifeThread.MIND]).toBeCloseTo(1.2, 2);
    });

    it('should apply stress penalties above threshold', () => {
      const highStressState = {
        ...defaultStressState,
        stress: 75 // 25 points above threshold
      };

      const result = service.calculateModifiers(
        highStressState,
        defaultSkillState
      );

      // 1.2 (energy) - 0.25 (stress) = 0.95
      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(0.95, 2);
    });

    it('should apply energy bonuses proportionally', () => {
      const lowEnergyState = {
        ...defaultStressState,
        energy: 50
      };

      const result = service.calculateModifiers(
        lowEnergyState,
        defaultSkillState
      );

      // 1.0 (base) + 0.1 (50% energy bonus) = 1.1
      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(1.1, 2);
    });

    it('should apply thread level bonuses', () => {
      const highLevelState = {
        ...defaultSkillState,
        threadLevels: {
          ...defaultSkillState.threadLevels,
          [LifeThread.BODY]: 50 // 5% bonus
        }
      };

      const result = service.calculateModifiers(
        defaultStressState,
        highLevelState
      );

      // 1.2 (energy) + 0.05 (level bonus) = 1.25
      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(1.25, 2);
    });

    it('should apply active effects', () => {
      const stateWithEffects = {
        ...defaultSkillState,
        activeEffects: [
          {
            id: 'test',
            threadId: LifeThread.BODY,
            modifier: 0.1,
            duration: 60,
            source: 'test'
          }
        ]
      };

      const result = service.calculateModifiers(
        defaultStressState,
        stateWithEffects
      );

      // 1.2 (energy) + 0.1 (effect) = 1.3
      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(1.3, 2);
    });

    it('should not go below minimum modifier', () => {
      const worstCaseState: StressEnergyState = {
        ...defaultStressState,
        energy: 0,
        stress: 100
      };

      const result = service.calculateModifiers(
        worstCaseState,
        defaultSkillState
      );

      expect(result.threadModifiers[LifeThread.BODY]).toBeCloseTo(0.1, 2);
    });
  });

  describe('stress management', () => {
    it('should calculate stress management bonus based on Mind and Heart levels', () => {
      const skillState = {
        ...defaultSkillState,
        threadLevels: {
          ...defaultSkillState.threadLevels,
          [LifeThread.MIND]: 50, // 10% bonus
          [LifeThread.HEART]: 50 // 10% bonus
        }
      };

      const bonus = service.calculateStressManagementBonus(skillState);
      expect(bonus).toBeCloseTo(0.2, 2); // 20% total bonus
    });

    it('should cap stress management bonus at 40%', () => {
      const skillState = {
        ...defaultSkillState,
        threadLevels: {
          ...defaultSkillState.threadLevels,
          [LifeThread.MIND]: 100, // 20% bonus
          [LifeThread.HEART]: 100 // 20% bonus
        }
      };

      const bonus = service.calculateStressManagementBonus(skillState);
      expect(bonus).toBeCloseTo(0.4, 2); // Capped at 40%
    });
  });

  describe('energy management', () => {
    it('should calculate energy management bonus based on Body and Mind levels', () => {
      const skillState = {
        ...defaultSkillState,
        threadLevels: {
          ...defaultSkillState.threadLevels,
          [LifeThread.BODY]: 50, // 10% bonus
          [LifeThread.MIND]: 50  // 5% bonus
        }
      };

      const bonus = service.calculateEnergyManagementBonus(skillState);
      expect(bonus).toBeCloseTo(0.15, 2); // 15% total bonus
    });

    it('should cap energy management bonus at 30%', () => {
      const skillState = {
        ...defaultSkillState,
        threadLevels: {
          ...defaultSkillState.threadLevels,
          [LifeThread.BODY]: 100, // 20% bonus
          [LifeThread.MIND]: 100  // 10% bonus
        }
      };

      const bonus = service.calculateEnergyManagementBonus(skillState);
      expect(bonus).toBeCloseTo(0.3, 2); // Capped at 30%
    });
  });
});