// src/domain/integration/__tests__/StressSkillIntegrationService.error.test.ts

import { StressSkillIntegrationService } from '../StressSkillIntegrationService';
import { LifeThread, SkillState } from '../../skills/types';
import { StressEnergyState } from '../../services/StressEnergyService';
import { ErrorHandler } from '@/infrastructure/ErrorHandler';

jest.mock('@/infrastructure/ErrorHandler', () => ({
  getInstance: jest.fn().mockReturnValue({
    handleError: jest.fn()
  })
}));

describe('StressSkillIntegrationService Error Handling', () => {
  let service: StressSkillIntegrationService;
  let mockErrorHandler: jest.Mocked<ErrorHandler>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = StressSkillIntegrationService.getInstance();
    mockErrorHandler = ErrorHandler.getInstance() as jest.Mocked<ErrorHandler>;
  });

  describe('calculateModifiers', () => {
    it('should handle null or undefined states', () => {
      const result = service.calculateModifiers(null as any, null as any);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        expect.any(Error),
        'StressSkillIntegrationService.calculateModifiers'
      );

      // Should return safe default values
      expect(result.threadModifiers[LifeThread.BODY]).toBe(0.1);
      expect(result.threadModifiers[LifeThread.MIND]).toBe(0.1);
      expect(Object.keys(result.skillModifiers)).toHaveLength(0);
    });

    it('should handle corrupted skill state', () => {
      const corruptedState: SkillState = {
        threadLevels: undefined as any,
        skillLevels: {},
        experience: {},
        activeEffects: []
      };

      const result = service.calculateModifiers(
        defaultStressState,
        corruptedState
      );

      expect(mockErrorHandler.handleError).toHaveBeenCalled();
      expect(result.threadModifiers[LifeThread.BODY]).toBe(0.1);
    });

    it('should handle NaN values in calculations', () => {
      const stateWithNaN: StressEnergyState = {
        ...defaultStressState,
        energy: NaN,
        stress: NaN
      };

      const result = service.calculateModifiers(
        stateWithNaN,
        defaultSkillState
      );

      expect(mockErrorHandler.handleError).toHaveBeenCalled();
      expect(result.threadModifiers[LifeThread.BODY]).toBe(0.1);
    });
  });

  describe('stress management', () => {
    it('should handle errors in stress management calculation', () => {
      const corruptedState: SkillState = {
        ...defaultSkillState,
        threadLevels: null as any
      };

      const result = service.calculateStressManagementBonus(corruptedState);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        expect.any(Error),
        'calculateStressManagementBonus'
      );
      expect(result).toBe(0);
    });
  });

  describe('energy management', () => {
    it('should handle errors in energy management calculation', () => {
      const corruptedState: SkillState = {
        ...defaultSkillState,
        threadLevels: null as any
      };

      const result = service.calculateEnergyManagementBonus(corruptedState);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        expect.any(Error),
        'calculateEnergyManagementBonus'
      );
      expect(result).toBe(0);
    });
  });

  // Helper constant
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
});