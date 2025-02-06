import { ResourceState } from '../../domain/resources/types';
import { TimeState } from '../../domain/time/types';
import { eventBus } from '../events/EventBus';

interface GameState {
  resources: ResourceState;
  time: TimeState;
  version: string;
  lastSaved: number;
}

export class StateService {
  private static readonly STORAGE_KEY = 'mmv_game_state';
  private static readonly CURRENT_VERSION = '1.0.0';

  async saveState(
    resources: ResourceState,
    time: TimeState
  ): Promise<void> {
    const state: GameState = {
      resources,
      time,
      version: StateService.CURRENT_VERSION,
      lastSaved: Date.now()
    };

    try {
      localStorage.setItem(
        StateService.STORAGE_KEY,
        JSON.stringify(state)
      );
      eventBus.publish('STATE_CHANGED', {
        type: 'STATE_CHANGED',
        path: ['save'],
        value: state,
        previousValue: null
      });
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw error;
    }
  }

  async loadState(): Promise<GameState | null> {
    const savedState = localStorage.getItem(StateService.STORAGE_KEY);
    
    if (!savedState) {
      return null;
    }

    try {
      const state = JSON.parse(savedState) as GameState;
      
      if (state.version !== StateService.CURRENT_VERSION) {
        // Handle version migration if needed
        console.warn('State version mismatch:', state.version);
      }

      eventBus.publish('STATE_CHANGED', {
        type: 'STATE_CHANGED',
        path: ['load'],
        value: state,
        previousValue: null
      });

      return state;
    } catch (error) {
      console.error('Failed to load game state:', error);
      throw error;
    }
  }

  async clearState(): Promise<void> {
    try {
      localStorage.removeItem(StateService.STORAGE_KEY);
      eventBus.publish('STATE_CHANGED', {
        type: 'STATE_CHANGED',
        path: ['clear'],
        value: null,
        previousValue: null
      });
    } catch (error) {
      console.error('Failed to clear game state:', error);
      throw error;
    }
  }
}