import { GameStateService } from '../../domain/game/GameStateService';
import { ScheduledActivity, GameState } from '../../domain/game/types';
import { EventBus } from '../EventBus';

export class GameStateManager {
  constructor(
    private gameStateService: GameStateService,
    private eventBus: EventBus
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('time:tick', this.handleTimeTick.bind(this));
    this.eventBus.subscribe('activity:scheduled', this.handleActivityScheduled.bind(this));
    this.eventBus.subscribe('character:updated', this.handleCharacterUpdate.bind(this));
  }

  private handleTimeTick(delta: number): void {
    this.gameStateService.updateTime(delta);
    this.checkScheduledActivities();
    this.eventBus.emit('state:updated', this.gameStateService.getState());
  }

  private handleActivityScheduled(activity: ScheduledActivity): void {
    try {
      this.gameStateService.scheduleActivity(activity);
      this.eventBus.emit('activity:scheduled:success', activity);
    } catch (error) {
      this.eventBus.emit('activity:scheduled:failed', {
        activity,
        error: error.message
      });
    }
  }

  private handleCharacterUpdate(update: any): void {
    this.gameStateService.updateCharacterState(
      update.energy,
      update.stress,
      update.belonging,
      update.health
    );
    this.eventBus.emit('state:updated', this.gameStateService.getState());
  }

  private checkScheduledActivities(): void {
    // Implementation depends on time system details
  }

  getState(): GameState {
    return this.gameStateService.getState();
  }
}