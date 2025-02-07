import { StressSkillIntegrationService } from '../StressSkillIntegrationService';
import { LifeThread, SkillState } from '../../skills/types';
import { GameState } from '../../types';

describe('StressSkillIntegrationService', () => {
  const createMockSkillState = (
    bodyLevel: number = 1,
    mindLevel: number = 1,
    heartLevel: number = 1
  ): SkillState => ({
    nodes: {},
    activeNodes: [],
    threadLevels: {
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
    studyHours: number = 0,
    workHours: number = 0,
    socialHours: number = 2
  ): GameState => ({
    energy,
    stress,
    restHours,
    studyHours,
    workHours,
    socialHours
  });

  describe('calculateModifiers', () => {
    it('should calculate base modifiers for level 1 skills', () => {
      const skillState = createMockSkillState(1, 1, 1);
      const modifiers = StressSkillIntegrationService.calculateModifiers(skillState);

      expect(modifiers.stressResistance).toBe(0.2); // (1 + 1) * 0.1
      expect(modifiers.energyEfficiency).toBe(0.2); // (1 + 1) * 0.1
      expect(modifiers.recoveryRate).toBe(1.1);     // 1 + (1 * 0.1)
    });

    it('should respect maximum modifier caps', () => {
      const skillState = createMockSkillState(5, 5, 5);
      const modifiers = StressSkillIntegrationService.calculateModifiers(skillState);

      expect(modifiers.stressResistance).toBe(0.5); // Capped at 0.5
      expect(modifiers.energyEfficiency).toBe(0.5); // Capped at 0.5
      expect(modifiers.recoveryRate).toBe(1.5);     // 1 + (5 * 0.1)
    });
  });

  describe('modifyStressIncrease', () => {
    it('should reduce stress based on skills', () => {
      const gameState = createMockGameState();
      const skillState = createMockSkillState(1, 2, 2);
      const baseStress = 10;

      const modifiedStress = StressSkillIntegrationService.modifyStressIncrease(
        gameState,
        skillState,
        baseStress
      );

      // (2 + 2) * 0.1 = 0.4 stress resistance
      expect(modifiedStress).toBe(6); // 10 * (1 - 0.4)
    });

    it('should maintain minimum stress increase', () => {
      const gameState = createMockGameState();
      const skillState = createMockSkillState(5, 5, 5); // Max skills
      const baseStress = 10;

      const modifiedStress = StressSkillIntegrationService.modifyStressIncrease(
        gameState,
        skillState,
        baseStress
      );

      // Maximum 50% reduction
      expect(modifiedStress).toBe(5); // 10 * (1 - 0.5)
    });
  });

  describe('calculateXPModifier', () => {
    it('should give bonus XP for high energy', () => {
      const state = createMockGameState(90, 0);
      const modifier = StressSkillIntegrationService.calculateXPModifier(state);
      expect(modifier).toBe(1.2); // 20% bonus
    });

    it('should apply penalty for high stress', () => {
      const state = createMockGameState(100, 80);
      const modifier = StressSkillIntegrationService.calculateXPModifier(state);
      expect(modifier).toBe(0.7); // 30% penalty
    });

    it('should combine energy bonus and stress penalty', () => {
      const state = createMockGameState(90, 80);
      const modifier = StressSkillIntegrationService.calculateXPModifier(state);
      expect(modifier).toBe(0.9); // 20% bonus - 30% penalty
    });
  });

  describe('updateStateWithSkills', () => {
    it('should apply skill modifiers to state updates', () => {
      const gameState = createMockGameState(100, 0, 8);
      const skillState = createMockSkillState(2, 2, 2);
      const delta = 1;

      const updatedState = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        delta
      );

      expect(updatedState.energy).toBeLessThan(gameState.energy);
      expect(updatedState.stress).toBe(0); // No stress increase in this scenario
    });

    it('should apply recovery during rest hours', () => {
      const gameState = createMockGameState(50, 50, 8);
      const skillState = createMockSkillState(2, 2, 2);
      const delta = 1;

      const updatedState = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        delta
      );

      expect(updatedState.energy).toBeGreaterThan(gameState.energy);
      expect(updatedState.stress).toBeLessThan(gameState.stress);
    });

    it('should respect energy and stress bounds', () => {
      const gameState = createMockGameState(10, 90, 8);
      const skillState = createMockSkillState(5, 5, 5);
      const delta = 1;

      const updatedState = StressSkillIntegrationService.updateStateWithSkills(
        gameState,
        skillState,
        delta
      );

      expect(updatedState.energy).toBeGreaterThanOrEqual(0);
      expect(updatedState.energy).toBeLessThanOrEqual(100);
      expect(updatedState.stress).toBeGreaterThanOrEqual(0);
      expect(updatedState.stress).toBeLessThanOrEqual(100);
    });
  });
});