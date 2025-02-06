import { Resources, ResourceService, ResourceModifiers } from '../../domain/resources/types';
import { EventBus } from '../../domain/shared/events';

export class ResourceManager implements ResourceService {
  private resources: Resources;
  private modifiers: ResourceModifiers;
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.resources = {
      energy: 100,
      stress: 0,
      money: 1000,
      knowledge: 0,
      social: 50
    };
    this.modifiers = {
      energyDrain: 1,
      stressIncrease: 1,
      moneyMultiplier: 1,
      knowledgeMultiplier: 1,
      socialMultiplier: 1
    };
  }

  getResources(): Resources {
    return { ...this.resources };
  }

  modifyResource(resource: keyof Resources, amount: number): void {
    let newValue = this.resources[resource];
    
    if (resource === 'energy' || resource === 'stress' || resource === 'social') {
      newValue = Math.max(0, Math.min(100, this.resources[resource] + amount));
    } else {
      newValue = Math.max(0, this.resources[resource] + amount);
    }

    if (newValue !== this.resources[resource]) {
      this.resources[resource] = newValue;
      this.eventBus.emit('RESOURCE_CHANGED', { resource, value: newValue });
    }
  }

  applyModifiers(modifiers: Partial<ResourceModifiers>): void {
    Object.assign(this.modifiers, modifiers);
    this.eventBus.emit('MODIFIERS_CHANGED', this.modifiers);
  }

  resetModifiers(): void {
    this.modifiers = {
      energyDrain: 1,
      stressIncrease: 1,
      moneyMultiplier: 1,
      knowledgeMultiplier: 1,
      socialMultiplier: 1
    };
    this.eventBus.emit('MODIFIERS_RESET', null);
  }
}