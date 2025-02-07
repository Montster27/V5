import { GameEvent, EventTrigger } from './types';
import { ResourceState } from '../resources/types';
import { SkillState } from '../skills/types';
import { GameState } from '../game/types';

export class EventGenerator {
  private eventPool: GameEvent[] = [];

  constructor(events: GameEvent[] = []) {
    this.eventPool = events;
  }

  generateEvents(
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): GameEvent[] {
    return this.eventPool.filter(event => 
      this.checkTriggerConditions(event.trigger, resources, skills, gameState)
    );
  }

  checkTriggerConditions(
    trigger: EventTrigger,
    resources: ResourceState,
    skills: SkillState,
    gameState: GameState
  ): boolean {
    const target = this.getTargetState(trigger.type, resources, skills, gameState);
    if (!target || !target[trigger.target]) return false;

    switch (trigger.operator) {
      case 'equals':
        return target[trigger.target] === trigger.value;
      case 'greater':
        return target[trigger.target] > trigger.value;
      case 'less':
        return target[trigger.target] < trigger.value;
      default:
        return false;
    }
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