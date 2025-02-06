import { CharacterStatusService, StatusEffect } from '../../domain/character/CharacterStatusService';
import { EventBus } from '../EventBus';
import { CharacterState } from '../../domain/game/types';

export class CharacterStatusManager {
  constructor(
    private statusService: CharacterStatusService,
    private eventBus: EventBus
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.subscribe('time:tick', this.handleTimeTick.bind(this));
    this.eventBus.subscribe('effect:applied', this.handleEffectApplied.bind(this));
    this.eventBus.subscribe('activity:completed', this.handleActivityCompleted.bind(this));
  }

  private handleTimeTick(delta: number): void {
    this.statusService.updateEffects(delta);
    this.emitStatusUpdate();
  }

  private handleEffectApplied(effect: StatusEffect): void {
    this.statusService.applyEffect(effect);
    this.emitStatusUpdate();
  }

  private handleActivityCompleted(activity: any): void {
    // Apply activity-specific effects
    this.emitStatusUpdate();
  }

  private emitStatusUpdate(): void {
    const status = this.statusService.getStatus();
    const effects = this.statusService.getActiveEffects();
    
    this.eventBus.emit('character:status:updated', {
      status,
      effects
    });
  }

  getStatus(): CharacterState {
    return this.statusService.getStatus();
  }

  getActiveEffects(): StatusEffect[] {
    return this.statusService.getActiveEffects();
  }
}