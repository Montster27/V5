import { GameEvent, TriggerCondition } from './types';
import { ResourceState } from '../resources/types';
import { SkillState } from '../skills/types';
import { GameState } from '../game/types';

export class EventGenerator {
  private eventPool: GameEvent[];

  constructor(events: GameEvent[]) {
    this.eventPool = events;
  }

  checkTriggerConditions(
    conditions: TriggerCondition[],
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): boolean {
    return conditions.every(condition => {
      const value = this.getStateValue(condition.type, condition.target, resources, skills, gameState);
      
      switch (condition.operator) {
        case 'gt': return value > condition.value;
        case 'lt': return value < condition.value;
        case 'eq': return value === condition.value;
        case 'gte': return value >= condition.value;
        case 'lte': return value <= condition.value;
        default: return false;
      }
    });
  }

  private getStateValue(
    type: string,
    target: string,
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): number {
    switch (type) {
      case 'resource': return resources[target] || 0;
      case 'skill': return skills[target]?.level || 0;
      case 'state': return gameState[target] || 0;
      default: return 0;
    }
  }

  generateEvents(
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): GameEvent[] {
    return this.eventPool.filter(event =>
      this.checkTriggerConditions(event.triggerConditions, resources, skills, gameState)
    );
  }
}