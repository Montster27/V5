import { SaveService, GameState } from '../domain/persistence/types';
import { TimeManager } from './time/TimeManager';
import { ResourceManager } from './resources/ResourceManager';
import { EventBus } from '../domain/shared/events';
import { GameStateService } from '../domain/game/GameStateService';

export class GameStateManager {
  private gameStateService: GameStateService;

  constructor(
    private timeManager: TimeManager,
    private resourceManager: ResourceManager,
    private eventBus: EventBus
  ) {
    this.gameStateService = new GameStateService(this.getInitialState());
    this.setupEventHandlers();
  }

  private checkScheduledActivities(): void {
    const state = this.gameStateService.getState();
    const activities = state.activityState.scheduledActivities;
    
    const currentTime = this.timeManager.getCurrentTime().hour;
    activities.forEach(activity => {
      if (activity.startTime <= currentTime && !activity.completed) {
        this.eventBus.emit('ACTIVITY_READY', activity);
      }
    });
  }

  private getInitialState(): GameState {
    return {
      time: this.timeManager.getCurrentTime(),
      resources: this.resourceManager.getState(),
      version: '1.0.0',
      timeState: { currentHour: 8, currentDay: 1 },
      characterState: { energy: 100, stress: 0, belonging: 50, health: 100 },
      activityState: { scheduledActivities: [] },
      worldState: { completedEvents: [] }
    };
  }

  private setupEventHandlers() {
    // Setup event handlers here
  }
  handleActivityScheduled(activity: any) {
    this.gameStateService.scheduleActivity(activity);
    this.eventBus.emit('ACTIVITY_SCHEDULED', activity);
  }

  handleCharacterUpdate(stats: any) {
    this.gameStateService.updateCharacterState(
      stats.energy,
      stats.stress,
      stats.belonging,
      stats.health
    );
    this.eventBus.emit('CHARACTER_UPDATED', stats);
  }

  checkScheduleConflicts(activity: any): boolean {
    try {
      this.gameStateService.scheduleActivity(activity);
      return false;
    } catch {
      return true;
    }
  }

  handleTimeTick(deltaTime: number) {
    this.checkScheduledActivities();
    this.gameStateService.updateTime(deltaTime);
    this.eventBus.emit('TIME_UPDATED', this.gameStateService.getState().timeState);
  }

  getState(): GameState {
    return {
      time: this.timeManager.getCurrentTime(),
      resources: this.resourceManager.getState(),
      version: '1.0.0'
    };
  }

  async saveGame(slotId: string): Promise<void> {
    const state = this.getState();
    this.eventBus.emit('GAME_SAVED', slotId);
  }

  async loadGame(slotId: string): Promise<void> {
    this.eventBus.emit('GAME_LOADED', slotId);
  }
}