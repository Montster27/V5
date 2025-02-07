// src/infrastructure/services/StressEnergyPersistenceService.ts

import { StressEnergyState } from '@/domain/services/StressEnergyService';
import { ErrorHandler } from '../ErrorHandler';

export class StressEnergyPersistenceService {
  private static readonly STORAGE_KEY = 'game_stress_energy_state';
  private errorHandler = ErrorHandler.getInstance();

  /**
   * Save state to localStorage
   */
  public async saveState(state: StressEnergyState): Promise<void> {
    try {
      localStorage.setItem(
        StressEnergyPersistenceService.STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      this.errorHandler.handleError(error, 'StressEnergyPersistenceService.saveState');
      throw error; // Re-throw to allow service to handle
    }
  }

  /**
   * Load state from localStorage
   */
  public async loadState(): Promise<StressEnergyState | null> {
    try {
      const stored = localStorage.getItem(StressEnergyPersistenceService.STORAGE_KEY);
      if (!stored) return null;

      const state = JSON.parse(stored) as StressEnergyState;
      
      // Validate loaded state
      if (this.isValidState(state)) {
        return state;
      } else {
        throw new Error('Invalid state structure detected');
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'StressEnergyPersistenceService.loadState');
      return null;
    }
  }

  /**
   * Clear saved state
   */
  public async clearState(): Promise<void> {
    try {
      localStorage.removeItem(StressEnergyPersistenceService.STORAGE_KEY);
    } catch (error) {
      this.errorHandler.handleError(error, 'StressEnergyPersistenceService.clearState');
      throw error;
    }
  }

  /**
   * Validate state structure
   */
  private isValidState(state: unknown): state is StressEnergyState {
    if (!state || typeof state !== 'object') return false;

    const s = state as Record<string, unknown>;
    
    // Check required properties and types
    const validations = [
      ['energy', 'number'],
      ['stress', 'number'],
      ['restHours', 'number'],
      ['activeHours', 'number'],
      ['studyHours', 'number'],
      ['workHours', 'number'],
      ['socialHours', 'number'],
      ['lastUpdate', 'number'],
    ] as const;

    return validations.every(([prop, type]) => {
      const value = s[prop];
      if (typeof value !== type) {
        this.errorHandler.handleWarning(
          `Invalid state property: ${prop} should be ${type}, got ${typeof value}`,
          'StressEnergyPersistenceService.isValidState'
        );
        return false;
      }
      return true;
    });
  }

  /**
   * Get initial state
   */
  public getInitialState(): StressEnergyState {
    return {
      energy: 100,
      stress: 0,
      restHours: 8,
      activeHours: 0,
      studyHours: 0,
      workHours: 0,
      socialHours: 0,
      lastUpdate: Date.now()
    };
  }
}