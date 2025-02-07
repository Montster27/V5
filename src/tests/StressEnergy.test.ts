import { jest } from '@jest/globals';
import { StressEnergyService } from '../domain/services/StressEnergyService';

describe('StressEnergyService', () => {
  let service: StressEnergyService;

  beforeEach(() => {
    service = new StressEnergyService();
  });

  describe('calculateEnergyDrain', () => {
    it('should drain energy based on active hours', () => {
      service.setEnergy(100);
      const activeHours = 8;
      const drain = service.calculateEnergyDrain(activeHours);
      expect(drain).toBeGreaterThan(0);
      expect(service.getEnergy()).toBeLessThan(100);
    });

    it('should apply rest deficit penalty', () => {
      service.setEnergy(80);
      const restDeficit = 4;
      const drain = service.calculateEnergyDrain(8, restDeficit);
      const normalDrain = service.calculateEnergyDrain(8, 0);
      expect(drain).toBeGreaterThan(normalDrain);
    });

    it('should apply overexertion penalty', () => {
      service.setEnergy(50);
      const drain = service.calculateEnergyDrain(12);
      expect(drain).toBeGreaterThan(service.calculateEnergyDrain(8));
    });
  });

  describe('calculateStressIncrease', () => {
    it('should increase stress for excessive study', () => {
      service.setStress(0);
      const stressIncrease = service.calculateStressIncrease('study', 6);
      expect(stressIncrease).toBeGreaterThan(0);
    });

    it('should increase stress for excessive work', () => {
      const stressIncrease = service.calculateStressIncrease('work', 8);
      expect(stressIncrease).toBeGreaterThan(0);
    });

    it('should increase stress for insufficient social hours', () => {
      const stressIncrease = service.calculateStressIncrease('social', 0);
      expect(stressIncrease).toBeGreaterThan(0);
    });

    it('should increase stress for insufficient rest', () => {
      const stressIncrease = service.calculateStressIncrease('rest', 4);
      expect(stressIncrease).toBeGreaterThan(0);
    });

    it('should combine multiple stress sources', () => {
      const studyStress = service.calculateStressIncrease('study', 6);
      const workStress = service.calculateStressIncrease('work', 8);
      const totalStress = service.calculateStressIncrease('combined', 14);
      expect(totalStress).toBeGreaterThan(studyStress);
      expect(totalStress).toBeGreaterThan(workStress);
    });
  });

  describe('calculateEfficiencyModifiers', () => {
    it('should calculate efficiency based on stress and energy', () => {
      service.setEnergy(80);
      service.setStress(20);
      const efficiency = service.calculateEfficiencyModifiers();
      expect(efficiency).toBeGreaterThan(0.5);
      expect(efficiency).toBeLessThan(1);
    });

    it('should not go below minimum efficiency', () => {
      service.setEnergy(10);
      service.setStress(90);
      const efficiency = service.calculateEfficiencyModifiers();
      expect(efficiency).toBeGreaterThanOrEqual(0.3);
    });
  });

  describe('updateState', () => {
    it('should keep energy and stress within bounds', () => {
      service.setEnergy(120);
      service.setStress(-10);
      service.updateState();
      expect(service.getEnergy()).toBeLessThanOrEqual(100);
      expect(service.getStress()).toBeGreaterThanOrEqual(0);
    });

    it('should update lastUpdate timestamp', () => {
      const before = Date.now();
      service.updateState();
      expect(service['lastUpdate']).toBeGreaterThanOrEqual(before);
    });
  });
});