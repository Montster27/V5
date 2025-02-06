import { StatusEffect } from '../character/CharacterStatusService';

export interface ActivityEffect {
  id: string;
  type: 'immediate' | 'duration';
  effects: StatusEffect[];
  requirements?: {
    attribute: string;
    value: number;
  }[];
}

export class ActivityEffectService {
  constructor(private activityEffects: Map<string, ActivityEffect[]>) {}

  getEffects(activityType: string, duration: number): StatusEffect[] {
    const effects = this.activityEffects.get(activityType) || [];
    return effects.flatMap(effect => 
      effect.type === 'duration' 
        ? effect.effects.map(e => ({...e, duration: duration}))
        : effect.effects
    );
  }

  checkRequirements(effect: ActivityEffect, currentState: any): boolean {
    return !effect.requirements?.some(req => 
      currentState[req.attribute] < req.value
    ) ?? true;
  }
}