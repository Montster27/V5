import { SaveService, GameState } from '../../domain/persistence/types';

export class LocalStorageSaveService implements SaveService {
  private readonly prefix = 'mmv_save_';
  private readonly currentVersion = '1.0.0';

  async saveGame(state: GameState, slotId: string): Promise<void> {
    const saveData = {
      ...state,
      version: this.currentVersion,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.prefix + slotId, JSON.stringify(saveData));
  }

  async loadGame(slotId: string): Promise<GameState> {
    const saveData = localStorage.getItem(this.prefix + slotId);
    if (!saveData) throw new Error('Save not found');
    
    const state = JSON.parse(saveData);
    if (state.version !== this.currentVersion) {
      // Implement migration if needed
      throw new Error('Incompatible save version');
    }
    
    return state;
  }

  async listSaves(): Promise<string[]> {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.slice(this.prefix.length));
  }

  async deleteSave(slotId: string): Promise<void> {
    localStorage.removeItem(this.prefix + slotId);
  }
}