import { GameStateRepository } from '../../infrastructure/persistence/GameStateRepository';
import { GameState } from '../../domain/game/types';
import { EventBus } from '../EventBus';

export class SaveManager {
  constructor(
    private repository: GameStateRepository,
    private eventBus: EventBus
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('state:save:requested', this.handleSaveRequest.bind(this));
    this.eventBus.subscribe('state:load:requested', this.handleLoadRequest.bind(this));
  }

  private async handleSaveRequest({ state, slot }: { state: GameState; slot: number }): Promise<void> {
    try {
      await this.repository.saveSlot(state, slot);
      this.eventBus.emit('state:save:completed', { slot });
    } catch (error) {
      this.eventBus.emit('state:save:failed', { slot, error: error.message });
    }
  }

  private async handleLoadRequest({ slot }: { slot: number }): Promise<void> {
    try {
      const state = await this.repository.loadSlot(slot);
      if (state) {
        this.eventBus.emit('state:load:completed', { state, slot });
      } else {
        throw new Error('Save slot empty');
      }
    } catch (error) {
      this.eventBus.emit('state:load:failed', { slot, error: error.message });
    }
  }

  async listSaveSlots(): Promise<number[]> {
    return await this.repository.listSaveSlots();
  }
}