export class StressEnergyService {
  private energy: number = 100;
  private stress: number = 0;
  private lastUpdate: number = Date.now();
  private readonly MIN_EFFICIENCY = 0.3;
  private readonly MAX_EFFICIENCY = 1.0;

  getEnergy(): number {
    return this.energy;
  }

  getStress(): number {
    return this.stress;
  }

  setEnergy(value: number): void {
    this.energy = this.clampValue(value, 0, 100);
  }

  setStress(value: number): void {
    this.stress = this.clampValue(value, 0, 100);
  }

  updateEnergy(delta: number): void {
    this.setEnergy(this.energy + delta);
  }

  updateStress(delta: number): void {
    this.setStress(this.stress + delta);
  }

  calculateEnergyDrain(activeHours: number, restDeficit: number = 0): number {
    let baseDrain = activeHours * 5; // Base drain per active hour
    
    // Apply rest deficit penalty
    if (restDeficit > 0) {
      baseDrain *= (1 + (restDeficit * 0.2));
    }

    // Apply overexertion penalty for long active periods
    if (activeHours > 8) {
      const overtimeHours = activeHours - 8;
      baseDrain += overtimeHours * 8;
    }

    // Actually apply the drain to energy
    this.updateEnergy(-baseDrain);

    return baseDrain;
  }

  calculateStressIncrease(activityType: string, hours: number): number {
    let stressIncrease = 0;

    switch (activityType) {
      case 'study':
        stressIncrease = hours > 4 ? (hours - 4) * 10 : 0;
        break;
      case 'work':
        stressIncrease = hours > 6 ? (hours - 6) * 8 : 0;
        break;
      case 'social':
        stressIncrease = hours < 2 ? (2 - hours) * 5 : 0;
        break;
      case 'rest':
        stressIncrease = hours < 6 ? (6 - hours) * 12 : 0;
        break;
      case 'combined':
        stressIncrease = hours > 12 ? (hours - 12) * 15 : 0;
        break;
    }

    // Actually apply the stress increase
    this.updateStress(stressIncrease);

    return stressIncrease;
  }

  calculateEfficiencyModifiers(): number {
    // Energy factor (0.3 to 1.0)
    const energyFactor = 0.3 + (this.energy / 100 * 0.7);
    
    // Stress penalty (0.5 to 1.0)
    const stressFactor = 1 - (this.stress / 100 * 0.5);
    
    // Combined efficiency
    let efficiency = energyFactor * stressFactor;
    
    // Ensure minimum efficiency
    return Math.max(this.MIN_EFFICIENCY, Math.min(this.MAX_EFFICIENCY, efficiency));
  }

  updateState(): void {
    // Ensure values are within bounds
    this.energy = this.clampValue(this.energy, 0, 100);
    this.stress = this.clampValue(this.stress, 0, 100);
    
    // Update timestamp
    this.lastUpdate = Date.now();
  }

  applyRecovery(type: string): void {
    switch (type) {
      case 'rest':
        this.updateEnergy(30);
        this.updateStress(-10);
        break;
      case 'meditation':
        this.updateEnergy(15);
        this.updateStress(-20);
        break;
      case 'exercise':
        this.updateEnergy(-10);
        this.updateStress(-15);
        break;
      default:
        this.updateEnergy(5);
        this.updateStress(-5);
    }
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}