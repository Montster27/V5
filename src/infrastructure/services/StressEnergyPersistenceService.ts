// /Users/montysharma/Documents/V5/mmv_clean/src/infrastructure/services/StressEnergyPersistenceService.ts

import { StressEnergyState } from '../../domain/shared/StressEnergyTypes';

const STORAGE_KEY = 'stressEnergyState';

export class StressEnergyPersistenceService {
  static saveState(state: StressEnergyState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save stress/energy state:', error);
    }
  }

  static loadState(): StressEnergyState | null {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Failed to load stress/energy state:', error);
    }
    return null;
  }

  static clearState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear stress/energy state:', error);
    }
  }
}