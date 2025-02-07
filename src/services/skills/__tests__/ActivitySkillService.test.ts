import { ActivitySkillService } from '../ActivitySkillService';
import { store } from '../../../store';
import { GameState } from '../../types';
import { Activity } from '../../activities/types';
import { ActivitySkillEffect } from '../types';
import { StressSkillIntegrationService } from '../../integration/StressSkillIntegrationService';

// Mock the store
jest.mock('../../../store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn()
  }
}));

// Mock the StressSkillIntegrationService
jest.mock('../../integration/StressSkillIntegrationService');

describe('ActivitySkillService', () => {
  const mockGameState: GameState = {
    energy: 100,
    stress: 0,
    restHours: 8,
    studyHours: 0,
    workHours: 0,
    socialHours: 2
  };

  const mockActivity: Activity = {
    id: 'test-activity',
    name: 'Test Activity',
    description: 'Test activity description',
    duration: 1,
    type: 'study'
  };

  const mockSkillEffect: ActivitySkillEffect = {
    skillId: 'test-skill',
    xpGain: 100,
    conditions: {
      minEnergy: 50,
      maxStress: 70
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (store.getState as jest.Mock).mockReturnValue({
      skills: {
        nodes: {
          'test-skill': {
            id: 'test-skill',
            level: 1,
            unlocked: true
          }
        }
      }
    });
    (StressSkillIntegrationService.calculateXPModifier as jest.Mock).mockReturnValue(1);
  });

  describe('processActivityEffects', () => {
    it('should process effects when conditions are met', () => {
      const effects = [mockSkillEffect];

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        effects
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            nodeId: 'test-skill',
            amount: 100
          })
        })
      );
    });

    it('should not process effects when energy condition fails', () => {
      const lowEnergyState = { ...mockGameState, energy: 40 };
      const effects = [mockSkillEffect];

      ActivitySkillService.processActivityEffects(
        lowEnergyState,
        mockActivity,
        effects
      );

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not process effects when stress condition fails', () => {
      const highStressState = { ...mockGameState, stress: 80 };
      const effects = [mockSkillEffect];

      ActivitySkillService.processActivityEffects(
        highStressState,
        mockActivity,
        effects
      );

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should apply XP modifier from StressSkillIntegrationService', () => {
      const effects = [mockSkillEffect];
      (StressSkillIntegrationService.calculateXPModifier as jest.Mock).mockReturnValue(1.5);

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        effects
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            amount: 150 // 100 * 1.5
          })
        })
      );
    });

    it('should process multiple effects independently', () => {
      const effects = [
        mockSkillEffect,
        { ...mockSkillEffect, skillId: 'test-skill-2', xpGain: 50 }
      ];

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        effects
      );

      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getActivitySkillRequirements', () => {
    it('should return empty requirements for basic activities', () => {
      const requirements = ActivitySkillService.getActivitySkillRequirements(
        mockActivity,
        mockGameState
      );

      expect(requirements).toEqual({
        required: [],
        recommended: []
      });
    });

    it('should return configured requirements for complex activities', () => {
      const complexActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ skillId: 'test-skill', level: 2 }],
          recommended: [{ skillId: 'test-skill-2', level: 1 }]
        }
      };

      const requirements = ActivitySkillService.getActivitySkillRequirements(
        complexActivity,
        mockGameState
      );

      expect(requirements).toEqual({
        required: [{ skillId: 'test-skill', level: 2 }],
        recommended: [{ skillId: 'test-skill-2', level: 1 }]
      });
    });
  });

  describe('meetsSkillRequirements', () => {
    it('should return true when requirements are met', () => {
      (store.getState as jest.Mock).mockReturnValue({
        skills: {
          nodes: {
            'test-skill': {
              id: 'test-skill',
              level: 3,
              unlocked: true
            }
          }
        }
      });

      const complexActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ skillId: 'test-skill', level: 2 }],
          recommended: []
        }
      };

      const result = ActivitySkillService.meetsSkillRequirements(
        complexActivity,
        mockGameState
      );

      expect(result).toBe(true);
    });

    it('should return false when skill level is too low', () => {
      (store.getState as jest.Mock).mockReturnValue({
        skills: {
          nodes: {
            'test-skill': {
              id: 'test-skill',
              level: 1,
              unlocked: true
            }
          }
        }
      });

      const complexActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ skillId: 'test-skill', level: 2 }],
          recommended: []
        }
      };

      const result = ActivitySkillService.meetsSkillRequirements(
        complexActivity,
        mockGameState
      );

      expect(result).toBe(false);
    });

    it('should return false when required skill is not unlocked', () => {
      (store.getState as jest.Mock).mockReturnValue({
        skills: {
          nodes: {
            'test-skill': {
              id: 'test-skill',
              level: 2,
              unlocked: false
            }
          }
        }
      });

      const complexActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ skillId: 'test-skill', level: 2 }],
          recommended: []
        }
      };

      const result = ActivitySkillService.meetsSkillRequirements(
        complexActivity,
        mockGameState
      );

      expect(result).toBe(false);
    });
  });
});