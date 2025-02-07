import { StressSkillIntegrationService } from '../StressSkillIntegrationService';
import { LifeThread, SkillState } from '../../skills/types';
import { GameState } from '../../types';

describe('StressSkillIntegrationService Error Handling', () => {
  const createMockSkillState = (
    bodyLevel: number = 1,
    mindLevel: number = 1,
    heartLevel: number = 1,
    corruptData: boolean = false
  ): SkillState => ({
    nodes: {},
    activeNodes: [],
    threadLevels: corruptData ? undefined : {
      [LifeThread.BODY]: bodyLevel,
      [LifeThread.MIND]: mindLevel,
      [LifeThread.HEART]: heartLevel,
      [LifeThread.WORLD]: 1,
      [LifeThread.MASTERY]: 1
    },
    totalXP: 0
  });

  const createMockGameState = (
    energy: number = 100,
    stress: number = 0,
    restHours: number = 8,
    corruptData: boolean = false
  ): GameState => ({
    energy: corruptData ? undefined : energy,
    stress: corruptData ? undefined : stress,
    restHours: corruptData ? undefined : restHours,
    studyHours: 0,
    workHours: 0,
    socialHours: 2
  });

  describe('calculateModifiers error handling', () => {
    it('should handle undefined skill state', () => {
      expect(() => {
        StressSkillIntegrationService.calculateModifiers(undefined);
      }).toThrow('Invalid skill state provided');
    });

    it('should handle corrupt thread levels', () => {
      const corruptState = createMockSkillState(1, 1, 1, true);
      expect(() => {
        StressSkillIntegrationService.calculateModifiers(corruptState);
      }).toThrow('Invalid thread levels in skill state');
    });

    it('should handle negative skill levels', () => {
      const skillState = createMockSkillState(-1, 1, 1);
      const modifiers = StressSkillIntegrationService.calculateModifiers(skillState);
      expect(modifiers.stressResistance).toBeGreaterThanOrEqual(0);
      expect(modifiers.energyEfficiency).toBeGreaterThanOrEqual(0);
      expect(modifiers.recoveryRate).toBeGreaterThanOrEqual(1);
    });
  });

  describe('updateStateWithSkills error handling', () => {
    it('should handle undefined game state', () => {
      const skillState = createMockSkillState();
      expect(() => {
        StressSkillIntegrationService.updateStateWithSkills(
          undefined,
          skillState,
          1
        );
      }).toThrow('Invalid game state provided');
    });

    it('should handle undefined energy/stress values', () => {
      const corruptGameState = createMockGameState(100, 0, 8, true);
      const skillState = createMockSkillState();
      
      expect(() => {
        StressSkillIntegrationService.updateStateWithSkills(
          corruptGameState,
          skillState,
          1
        );
      }).toThrow('Invalid energy or stress values in game state');
    });

    it('should handle negative delta values', () => {
      const gameState = createMockGameState();
      const skillState = createMockSkillState();
      
      expect(() => {
        StressSkillIntegrationService.updateStateWithSkills(
          gameState,
          skillState,
          -1
        );
      }).toThrow('Delta value must be positive');
    });

    it('should handle NaN values in calculations', () => {
      const gameState = createMockGameState();
      const skillState = createMockSkillState();
      
      // Mock a calculation that could return NaN
      jest.spyOn(StressSkillIntegrationService as any, 'calculateModifiers')
        .mockReturnValue({
          stressResistance: NaN,
          energyEfficiency: NaN,
          recoveryRate: NaN
        });

      const result = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        1
      );

      expect(result.energy).not.toBeNaN();
      expect(result.stress).not.toBeNaN();
    });
  });

  describe('calculateXPModifier error handling', () => {
    it('should handle corrupt game state', () => {
      const corruptGameState = createMockGameState(100, 0, 8, true);
      expect(() => {
        StressSkillIntegrationService.calculateXPModifier(corruptGameState);
      }).toThrow('Invalid game state for XP calculation');
    });

    it('should handle out of bounds energy values', () => {
      const gameState = { ...createMockGameState(150, 0) };
      const modifier = StressSkillIntegrationService.calculateXPModifier(gameState);
      expect(modifier).toBeLessThanOrEqual(1.2); // Maximum bonus
    });

    it('should handle out of bounds stress values', () => {
      const gameState = { ...createMockGameState(100, 150) };
      const modifier = StressSkillIntegrationService.calculateXPModifier(gameState);
      expect(modifier).toBeGreaterThanOrEqual(0.7); // Maximum penalty
    });
  });

  describe('recovery calculations error handling', () => {
    it('should handle invalid rest hours', () => {
      const gameState = { ...createMockGameState(), restHours: -1 };
      const skillState = createMockSkillState();
      
      const result = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        1
      );

      expect(result.energy).toBeLessThanOrEqual(gameState.energy);
      expect(result.stress).toBeGreaterThanOrEqual(gameState.stress);
    });

    it('should handle excessive rest hours', () => {
      const gameState = { ...createMockGameState(), restHours: 24 };
      const skillState = createMockSkillState();
      
      const result = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        1
      );

      expect(result.energy).toBeLessThanOrEqual(100);
      expect(result.stress).toBeGreaterThanOrEqual(0);
    });
  });
});