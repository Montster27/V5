import { CharacterState } from '../game/types';

export interface StatusEffect {
  type: 'buff' | 'debuff';
  attribute: keyof CharacterState;
  value: number;
  duration: number;
  source: string;
}

export class CharacterStatusService {
  private activeEffects: StatusEffect[] = [];

  constructor(private characterState: CharacterState) {}

  applyEffect(effect: StatusEffect): void {
    this.activeEffects.push(effect);
    this.updateCharacterState();
  }

  updateEffects(deltaTime: number): void {
    this.activeEffects = this.activeEffects
      .map(effect => ({ ...effect, duration: effect.duration - deltaTime }))
      .filter(effect => effect.duration > 0);
    
    this.updateCharacterState();
  }

  private updateCharacterState(): void {
    const baseState = { ...this.characterState };
    
    this.activeEffects.forEach(effect => {
      const currentValue = this.characterState[effect.attribute];
      const modifier = effect.type === 'buff' ? effect.value : -effect.value;
      this.characterState[effect.attribute] = Math.max(0, Math.min(100, currentValue + modifier));
    });
  }

  getActiveEffects(): StatusEffect[] {
    return [...this.activeEffects];
  }

  getStatus(): CharacterState {
    return { ...this.characterState };
  }
}