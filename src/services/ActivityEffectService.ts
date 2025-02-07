import { ActivityEffect, Effect } from '../types/activity';
import { EventBus } from '../application/EventBus';

export class ActivityEffectService {
  private effects: Map<string, ActivityEffect[]>;
  private eventBus: EventBus;

  constructor(effects: Map<string, ActivityEffect[]>, eventBus?: EventBus) {
    this.effects = effects;
    this.eventBus = eventBus || new EventBus();
  }

  applyEffect(effectId: string, targetId: string): void {
    const effects = this.effects.get(effectId);
    if (!effects) return;

    effects.forEach(effect => {
      this.processEffect(effect, targetId);
    });
  }

  private processEffect(effect: ActivityEffect, targetId: string): void {
    effect.effects.forEach(subEffect => {
      this.eventBus.emit('effect:applied', {
        targetId,
        effect: subEffect,
      });
    });
  }

  removeEffect(effectId: string, targetId: string): void {
    const effects = this.effects.get(effectId);
    if (!effects) return;

    effects.forEach(effect => {
      if (effect.type === 'duration') {
        this.eventBus.emit('effect:removed', {
          targetId,
          effectId,
        });
      }
    });
  }
}