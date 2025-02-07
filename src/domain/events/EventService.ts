import { GameEvent, EventEffect, EventChoice } from './types';
import { ResourceState } from '../resources/types';
import { SkillState } from '../skills/types';
import { GameState } from '../game/types';
import { EventGenerator } from './EventGenerator';

export class EventService {
  private eventGenerator: EventGenerator;

  constructor() {
    // Initialize with empty event pool for now
    this.eventGenerator = new EventGenerator([]);
  }

  checkForEvents(
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): GameEvent[] {
    return this.eventGenerator.generateEvents(resources, skills, gameState);
  }

  processEventChoice(
    event: GameEvent,
    choice: EventChoice,
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): void {
    if (choice.requirements && !this.eventGenerator.checkTriggerConditions(
      choice.requirements[0],
      resources,
      skills,
      gameState
    )) {
      throw new Error('Choice requirements not met');
    }

    this.applyEffects(choice.effects, resources, skills, gameState);
  }

  private applyEffects(
    effects: EventEffect[],
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): void {
    effects.forEach(effect => {
      const target = this.getTargetState(effect.type, resources, skills, gameState);
      if (!target || !target[effect.target]) return;

      switch (effect.operator) {
        case 'add':
          target[effect.target] += effect.value;
          break;
        case 'subtract':
          target[effect.target] -= effect.value;
          break;
        case 'multiply':
          target[effect.target] *= effect.value;
          break;
        case 'set':
          target[effect.target] = effect.value;
          break;
      }
    });
  }

  private getTargetState(
    type: string,
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): any {
    switch (type) {
      case 'resource': return resources;
      case 'skill': return skills;
      case 'state': return gameState;
      default: return null;
    }
  }
}