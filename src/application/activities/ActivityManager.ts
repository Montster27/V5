import { ActivityEffectService } from '../../domain/activities/ActivityEffectService';
import { EventBus } from '../../infrastructure/events/EventBus';
import { CharacterStatusManager } from '../character/CharacterStatusManager';

export class ActivityManager {
  constructor(
    private effectService: ActivityEffectService,
    private characterManager: CharacterStatusManager,
    private eventBus: EventBus
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('activity:started', this.handleActivityStart.bind(this));
    this.eventBus.subscribe('activity:completed', this.handleActivityComplete.bind(this));
  }

  private handleActivityStart(activity: { type: string; duration: number }): void {
    const effects = this.effectService.getEffects(activity.type, activity.duration);
    effects.forEach(effect => {
      this.eventBus.emit('effect:applied', effect);
    });
  }

  private handleActivityComplete(activity: { type: string; duration: number }): void {
    const state = this.characterManager.getStatus();
    const endEffects = this.effectService.getEffects(activity.type, 0);
    
    endEffects.forEach(effect => {
      if (this.effectService.checkRequirements({ effects: [effect] }, state)) {
        this.eventBus.emit('effect:applied', effect);
      }
    });
  }
}