import { ResourceState, ResourceUpdate, ResourceModifier, ResourceType, RESOURCE_LIMITS } from '../../domain/resources/types';
import { eventBus } from '../../infrastructure/events/EventBus';

export class ResourceService {
  private state: ResourceState;
  private modifiers: ResourceModifier[] = [];

  constructor() {
    this.state = {
      energy: RESOURCE_LIMITS.energy.default,
      stress: RESOURCE_LIMITS.stress.default,
      money: RESOURCE_LIMITS.money.default,
      knowledge: RESOURCE_LIMITS.knowledge.default,
      social: RESOURCE_LIMITS.social.default
    };
  }

  updateResource(update: ResourceUpdate): void {
    const currentValue = this.state[update.type];
    const multiplier = this.calculateModifier(update.type);
    const newValue = currentValue + (update.amount * multiplier);
    const limits = RESOURCE_LIMITS[update.type];
    
    this.state[update.type] = Math.max(limits.min, Math.min(limits.max, newValue));

    eventBus.publish('RESOURCE_CHANGED', {
      type: 'RESOURCE_CHANGED',
      resource: update.type,
      value: this.state[update.type],
      delta: this.state[update.type] - currentValue
    });
  }

  addModifier(modifier: ResourceModifier): void {
    this.modifiers.push(modifier);
  }

  removeExpiredModifiers(): void {
    this.modifiers = this.modifiers.filter(mod => mod.duration > 0);
  }

  private calculateModifier(type: ResourceType): number {
    const activeModifiers = this.modifiers.filter(mod => mod.type === type);
    return activeModifiers.reduce((total, mod) => total * mod.multiplier, 1);
  }

  getResource(type: ResourceType): number {
    return this.state[type];
  }

  getAllResources(): ResourceState {
    return { ...this.state };
  }
}