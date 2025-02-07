// /Users/montysharma/Documents/V5/mmv_clean/src/tests/StressEnergy.test.ts

import { StressEnergyService } from '../domain/shared/StressEnergyService';
import { StressEnergyState } from '../domain/shared/StressEnergyTypes';

describe('StressEnergyService', () => {
  const defaultState: StressEnergyState = {
    energy: 100,
    stress: 0,
    restHours: 8,
    activeHours: 0,
    studyHours: 0,
    workHours: 0,
    socialHours: 0
  };

  describe('calculateEnergyDrain', () => {
    it('should drain energy based on active hours', () => {
      const state = { ...defaultState, activeHours: 4 };
      const drain = StressEnergyService.calculateEnergyDrain(state, 1);
      expect(drain).toBe(-20); // -5 * 4 active hours
    });

    it('should apply rest deficit penalty', () => {
      const state = { ...defaultState, restHours: 6 };
      const drain = StressEnergyService.calculateEnergyDrain(state, 1);
      expect(drain).toBe(-6); // -3 * 2 hours deficit
    });

    it('should apply overexertion penalty', () => {
      const state = { ...defaultState, activeHours: 13 };
      const drain = StressEnergyService.calculateEnergyDrain(state, 1);
      expect(drain).toBe(-75); // (-5 * 13) + -10 overexertion
    });
  });

  describe('calculateStressIncrease', () => {
    it('should increase stress for excessive study', () => {
      const state = { ...defaultState, studyHours: 8 };
      const increase = StressEnergyService.calculateStressIncrease(state, 1);
      expect(increase).toBe(4); // (8 - 6) * 2
    });

    it('should increase stress for excessive work', () => {
      const state = { ...defaultState, workHours: 10 };
      const increase = StressEnergyService.calculateStressIncrease(state, 1);
      expect(increase).toBe(4); // (10 - 8) * 2
    });

    it('should increase stress for insufficient social hours', () => {
      const state = { ...defaultState, socialHours: 1 };
      const increase = StressEnergyService.calculateStressIncrease(state, 1);
      expect(increase).toBe(5);
    });

    it('should increase stress for insufficient rest', () => {
      const state = { ...defaultState, restHours: 4 };
      const increase = StressEnergyService.calculateStressIncrease(state, 1);
      expect(increase).toBe(6); // (6 - 4) * 3
    });
  });

  describe('calculateEfficiencyModifiers', () => {
    it('should calculate efficiency based on stress and energy', () => {
      const state = { ...defaultState, energy: 80, stress: 40 };
      const modifiers = StressEnergyService.calculateEfficiencyModifiers(state);
      // efficiency = (1 - 40/200) * (80/100) = 0.8 * 0.8 = 0.64
      expect(modifiers.energyModifier).toBeCloseTo(0.64);
      expect(modifiers.stressModifier).toBeCloseTo(0.64);
    });

    it('should not go below minimum efficiency', () => {
      const state = { ...defaultState, energy: 20, stress: 90 };
      const modifiers = StressEnergyService.calculateEfficiencyModifiers(state);
      expect(modifiers.energyModifier).toBe(0.1);
      expect(modifiers.stressModifier).toBe(0.1);
    });
  });

  describe('updateState', () => {
    it('should update energy and stress within bounds', () => {
      const state = { 
        ...defaultState, 
        energy: 50, 
        stress: 30,
        activeHours: 4,
        workHours: 10 
      };
      const newState = StressEnergyService.updateState(state, 1);
      
      expect(newState.energy).toBeGreaterThanOrEqual(0);
      expect(newState.energy).toBeLessThanOrEqual(100);
      expect(newState.stress).toBeGreaterThanOrEqual(0);
      expect(newState.stress).toBeLessThanOrEqual(100);
    });
  });
});