import { SaveService, GameState } from '../domain/persistence/types';
import { TimeService } from '../domain/time/types';
import { ResourceService } from '../domain/resources/types';
import { EventService } from '../domain/events/types';
import { EventBus } from '../domain/shared/events';

export class GameStateManager {
  constructor(
    private timeService: TimeService,
    private resourceService: ResourceService,
    private eventService: EventService,
    private saveService: SaveService,
    private eventBus: EventBus
  ) {}

  async saveGame(slotId: string): Promise<void> {
    const state: GameState = {
      time: this.timeService.getCurrentTime(),
      resources: this.resourceService.getResources(),
      activeEvents: this.eventService.getCurrentEvents(),
      scheduledEvents: [], // TODO: Add method to get scheduled events
      version: '1.0.0'
    };

    await this.saveService.saveGame(state, slotId);
    this.eventBus.emit('GAME_SAVED', slotId);
  }

  async loadGame(slotId: string): Promise<void> {
    const state = await this.saveService.loadGame(slotId);
    // TODO: Implement state restoration logic for each service
    this.eventBus.emit('GAME_LOADED', slotId);
  }
}