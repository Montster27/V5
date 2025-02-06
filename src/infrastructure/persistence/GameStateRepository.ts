import { GameState } from '../../domain/game/types';

export class GameStateRepository {
  private readonly STORAGE_KEY = 'game_state';

  async save(state: GameState): Promise<void> {
    const serialized = JSON.stringify(state);
    localStorage.setItem(this.STORAGE_KEY, serialized);
  }

  async load(): Promise<GameState | null> {
    const serialized = localStorage.getItem(this.STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : null;
  }

  async saveSlot(state: GameState, slot: number): Promise<void> {
    const serialized = JSON.stringify(state);
    localStorage.setItem(`${this.STORAGE_KEY}_${slot}`, serialized);
  }

  async loadSlot(slot: number): Promise<GameState | null> {
    const serialized = localStorage.getItem(`${this.STORAGE_KEY}_${slot}`);
    return serialized ? JSON.parse(serialized) : null;
  }

  async listSaveSlots(): Promise<number[]> {
    const slots: number[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.STORAGE_KEY}_`)) {
        const slot = parseInt(key.split('_')[2]);
        slots.push(slot);
      }
    }
    return slots.sort();
  }
}