import { store } from '../../application/store';
import { SaveGame, CURRENT_SAVE_VERSION } from './types';
import { GameError } from '../../domain/shared/GameError';

export class SaveManager {
  private readonly SAVE_FILE = 'mmv_save.json';
  private readonly SAVE_PATH = 'saves/';
  private lastSaveDay = 1;
  private errorHandlers: ((error: GameError) => void)[] = [];

  constructor() {}

  public registerErrorHandler(handler: (error: GameError) => void): void {
    this.errorHandlers.push(handler);
  }

  private handleError(error: GameError): void {
    console.error(`[SaveManager] ${error.code}:`, error.message, error.context);
    this.errorHandlers.forEach(handler => handler(error));
  }

  public async saveIfNeeded(): Promise<void> {
    try {
      const state = store.getState();
      const currentDay = state.time.currentDay;

      // Save every 7 in-game days
      if (currentDay >= this.lastSaveDay + 7) {
        const saveGame: SaveGame = {
          gameState: {
            time: state.time,
            resources: state.resources,
            character: state.character,
            events: {
              ...state.events,
              // Clear active event and queue to prevent state conflicts on load
              activeEvent: null,
              eventQueue: []
            }
          },
          version: CURRENT_SAVE_VERSION
        };

        await window.fs.writeFile(
          `${this.SAVE_PATH}${this.SAVE_FILE}`, 
          JSON.stringify(saveGame, null, 2)
        );

        this.lastSaveDay = currentDay;
      }
    } catch (error) {
      this.handleError(new GameError(
        'Failed to save game',
        'SAVE_ERROR',
        'warning',
        { originalError: error }
      ));
    }
  }

  public async loadGame(): Promise<void> {
    try {
      const saveData = await window.fs.readFile(
        `${this.SAVE_PATH}${this.SAVE_FILE}`, 
        { encoding: 'utf8' }
      );
      const saveGame: SaveGame = JSON.parse(saveData);

      // Version check and migration would go here
      if (saveGame.version !== CURRENT_SAVE_VERSION) {
        console.warn('Save game version mismatch, migration may be needed');
      }

      // Reset store with saved state
      store.dispatch({ type: 'LOAD_GAME', payload: saveGame.gameState });
      this.lastSaveDay = saveGame.gameState.time.currentDay;

    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        // No save file exists - this is fine for new games
        return;
      }
      this.handleError(new GameError(
        'Failed to load game',
        'LOAD_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }

  public async resetSave(): Promise<void> {
    try {
      await window.fs.unlink(`${this.SAVE_PATH}${this.SAVE_FILE}`);
      // Reset the store to initial state
      store.dispatch({ type: 'RESET_GAME' });
      this.lastSaveDay = 1;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        // File doesn't exist - just reset the store
        store.dispatch({ type: 'RESET_GAME' });
        this.lastSaveDay = 1;
        return;
      }
      this.handleError(new GameError(
        'Failed to reset save',
        'RESET_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }
}