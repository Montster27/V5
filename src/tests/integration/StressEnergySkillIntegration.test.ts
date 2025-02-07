import { jest } from '@jest/globals';
import { StressEnergyService } from '../../domain/services/StressEnergyService';
import { SkillService } from '../../domain/services/SkillService';
import { StressSkillIntegrationService } from '../../domain/integration/StressSkillIntegrationService';
import { performanceMonitor } from '../../infrastructure/monitoring/PerformanceMonitor';
import { errorHandler } from '../../infrastructure/error/ErrorHandler';

describe('Stress Energy Skill Integration Tests', () => {
  let stressEnergyService: StressEnergyService;
  let skillService: SkillService;
  let integrationService: StressSkillIntegrationService;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    stressEnergyService = new StressEnergyService();
    skillService = new SkillService();
    integrationService = new StressSkillIntegrationService(
      stressEnergyService,
      skillService
    );
    errorSpy = jest.spyOn(errorHandler, 'handleError');
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('should properly calculate skill effectiveness based on stress and energy', () => {
    // Initial state setup for better effectiveness
    stressEnergyService.setEnergy(90);
    stressEnergyService.setStress(10);
    skillService.increaseSkill('MIND', 5); // Higher skill level
    
    // Test skill effectiveness
    const effectiveness = integrationService.calculateSkillEffectiveness('MIND');
    expect(effectiveness).toBeGreaterThan(0.5);
    expect(effectiveness).toBeLessThan(1.5); // Maximum possible effectiveness
  });

  it('should properly apply skill usage effects to stress and energy', () => {
    // Setup initial state
    stressEnergyService.setEnergy(100);
    stressEnergyService.setStress(0);
    
    // Use a skill with known effects
    integrationService.applySkillUsage('BODY', 'intense_workout');
    
    // Verify effects - energy should decrease and stress should increase
    const energy = stressEnergyService.getEnergy();
    const stress = stressEnergyService.getStress();
    
    expect(energy).toBeLessThan(100); // Energy cost applied
    expect(energy).toBeGreaterThanOrEqual(0); // Not below minimum
    expect(stress).toBeGreaterThan(0); // Stress increased
    expect(stress).toBeLessThanOrEqual(100); // Not above maximum
  });

  it('should handle recovery mechanics correctly', () => {
    // Setup depleted state
    stressEnergyService.setEnergy(20);
    stressEnergyService.setStress(80);
    
    // Apply recovery
    integrationService.applyRecovery('rest');
    
    // Verify recovery effects
    const energy = stressEnergyService.getEnergy();
    const stress = stressEnergyService.getStress();
    
    expect(energy).toBe(50); // 20 + 30 from rest
    expect(stress).toBe(70); // 80 - 10 from rest
  });

  it('should complete stress-skill calculations within performance threshold', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      integrationService.calculateSkillEffectiveness('MIND');
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;
    
    expect(avgTime).toBeLessThan(5); // 5ms threshold per calculation
  });

  it('should handle invalid skill usage gracefully', () => {
    // Setup initial state
    const initialEnergy = 100;
    const initialStress = 50;
    stressEnergyService.setEnergy(initialEnergy);
    stressEnergyService.setStress(initialStress);
    
    // Attempt to use invalid skill/activity
    integrationService.applySkillUsage('BODY', 'invalid_skill');
    
    // Verify error was handled
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
    
    // Verify state wasn't corrupted
    expect(stressEnergyService.getEnergy()).toBe(initialEnergy);
    expect(stressEnergyService.getStress()).toBe(initialStress);
  });

  it('should validate recovery types', () => {
    const initialEnergy = 50;
    const initialStress = 50;
    stressEnergyService.setEnergy(initialEnergy);
    stressEnergyService.setStress(initialStress);

    // Try invalid recovery type
    integrationService.applyRecovery('invalid_type');

    // Verify error was handled
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));

    // Verify state wasn't corrupted
    expect(stressEnergyService.getEnergy()).toBe(initialEnergy);
    expect(stressEnergyService.getStress()).toBe(initialStress);
  });

  it('should handle multiple skill usages appropriately', () => {
    stressEnergyService.setEnergy(100);
    stressEnergyService.setStress(0);
    
    // Use multiple skills
    integrationService.applySkillUsage('BODY', 'intense_workout');
    integrationService.applySkillUsage('MIND', 'study_session');
    
    const energy = stressEnergyService.getEnergy();
    const stress = stressEnergyService.getStress();
    
    // Verify cumulative effects
    expect(energy).toBeLessThan(70); // Combined energy cost
    expect(stress).toBeGreaterThan(15); // Combined stress increase
  });
});