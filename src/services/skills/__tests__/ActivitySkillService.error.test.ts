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

describe('ActivitySkillService Error Handling', () => {
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
  });

  describe('processActivityEffects error handling', () => {
    it('should handle undefined activity', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'test-skill',
        xpGain: 100
      };

      expect(() => {
        ActivitySkillService.processActivityEffects(
          mockGameState,
          undefined,
          [effect]
        );
      }).toThrow('Invalid activity provided');
    });

    it('should handle null effects array', () => {
      expect(() => {
        ActivitySkillService.processActivityEffects(
          mockGameState,
          mockActivity,
          null
        );
      }).toThrow('Invalid effects array');
    });

    it('should handle invalid skill IDs', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'non-existent-skill',
        xpGain: 100
      };

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        [effect]
      );

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle negative XP gains', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'test-skill',
        xpGain: -100
      };

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        [effect]
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            amount: 0 // Should normalize negative XP to 0
          })
        })
      );
    });

    it('should handle store dispatch errors', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'test-skill',
        xpGain: 100
      };

      (store.dispatch as jest.Mock).mockImplementation(() => {
        throw new Error('Dispatch failed');
      });

      expect(() => {
        ActivitySkillService.processActivityEffects(
          mockGameState,
          mockActivity,
          [effect]
        );
      }).toThrow('Failed to process activity effects');
    });
  });

  describe('meetsSkillRequirements error handling', () => {
    it('should handle corrupt skill state in store', () => {
      (store.getState as jest.Mock).mockReturnValue({
        skills: undefined
      });

      const result = ActivitySkillService.meetsSkillRequirements(
        mockActivity,
        mockGameState
      );

      expect(result).toBe(false);
    });

    it('should handle missing skill nodes', () => {
      (store.getState as jest.Mock).mockReturnValue({
        skills: {
          nodes: undefined
        }
      });

      const result = ActivitySkillService.meetsSkillRequirements(
        mockActivity,
        mockGameState
      );

      expect(result).toBe(false);
    });

    it('should handle invalid skill requirement format', () => {
      const invalidActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ invalidFormat: true }]
        }
      };

      expect(() => {
        ActivitySkillService.meetsSkillRequirements(
          invalidActivity,
          mockGameState
        );
      }).toThrow('Invalid skill requirement format');
    });
  });

  describe('getActivitySkillRequirements error handling', () => {
    it('should handle undefined activity', () => {
      const requirements = ActivitySkillService.getActivitySkillRequirements(
        undefined,
        mockGameState
      );

      expect(requirements).toEqual({
        required: [],
        recommended: []
      });
    });

    it('should handle malformed skill requirements', () => {
      const invalidActivity = {
        ...mockActivity,
        skillRequirements: 'invalid'
      };

      const requirements = ActivitySkillService.getActivitySkillRequirements(
        invalidActivity,
        mockGameState
      );

      expect(requirements).toEqual({
        required: [],
        recommended: []
      });
    });

    it('should handle partially corrupt skill requirements', () => {
      const partiallyInvalidActivity = {
        ...mockActivity,
        skillRequirements: {
          required: [{ skillId: 'test-skill', level: 'invalid' }],
          recommended: []
        }
      };

      const requirements = ActivitySkillService.getActivitySkillRequirements(
        partiallyInvalidActivity,
        mockGameState
      );

      expect(requirements.required).toEqual([]);
    });
  });

  describe('XP modification error handling', () => {
    it('should handle NaN XP modifiers', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'test-skill',
        xpGain: 100
      };

      (StressSkillIntegrationService.calculateXPModifier as jest.Mock)
        .mockReturnValue(NaN);

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        [effect]
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            amount: 100 // Should use original XP if modifier is invalid
          })
        })
      );
    });

    it('should handle excessive XP modifiers', () => {
      const effect: ActivitySkillEffect = {
        skillId: 'test-skill',
        xpGain: 100
      };

      (StressSkillIntegrationService.calculateXPModifier as jest.Mock)
        .mockReturnValue(1000);

      ActivitySkillService.processActivityEffects(
        mockGameState,
        mockActivity,
        [effect]
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            amount: expect.any(Number)
          })
        })
      );
      
      const dispatchCall = (store.dispatch as jest.Mock).mock.calls[0][0];
      expect(dispatchCall.payload.amount).toBeLessThanOrEqual(1000); // Should have reasonable upper limit
    });
  });
});