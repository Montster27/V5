import { ActivityEffectService } from '../../domain/activities/ActivityEffectService';
import { EventBus } from '../EventBus';
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

  private handleActivityStart(activity: any): void {
    const effects = this.effectService.getEffects(activity.type, activity.duration);
    effects.forEach(effect => {
      this.eventBus.emit('effect:applied', effect);
    });
  }

  private handleActivityComplete(activity: any): void {
    const state = this.characterManager.getStatus();
    const endEffects = this.effectService.getEffects(activity.type, 0);
    
    endEffects.forEach(effect => {
      if (this.effectService.checkRequirements({ effects: [effect] }, state)) {
        this.eventBus.emit('effect:applied', effect);
      }
    });
  }
}