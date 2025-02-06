import { Activity } from '../../domain/activities/types';
import { ResourceService } from './ResourceService';
import { eventBus } from '../../infrastructure/events/EventBus';

export class ActivityService {
  private resourceService: ResourceService;

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  performActivity(activity: Activity): boolean {
    if (!this.checkRequirements(activity)) {
      return false;
    }

    this.applyCosts(activity);
    this.applyRewards(activity);

    eventBus.publish('ACTIVITY_COMPLETED', {
      type: 'ACTIVITY_COMPLETED',
      activity: activity.name,
      duration: activity.duration
    });

    return true;
  }

  private checkRequirements(activity: Activity): boolean {
    if (!activity.requirements) return true;

    if (activity.requirements.energy && 
        this.resourceService.getResource('energy') < activity.requirements.energy) {
      return false;
    }

    if (activity.requirements.money && 
        this.resourceService.getResource('money') < activity.requirements.money) {
      return false;
    }

    return true;
  }

  private applyCosts(activity: Activity): void {
    if (activity.costs.energy) {
      this.resourceService.updateResource({
        type: 'energy',
        amount: -activity.costs.energy,
        source: activity.name
      });
    }

    if (activity.costs.money) {
      this.resourceService.updateResource({
        type: 'money',
        amount: -activity.costs.money,
        source: activity.name
      });
    }

    if (activity.costs.stress) {
      this.resourceService.updateResource({
        type: 'stress',
        amount: activity.costs.stress,
        source: activity.name
      });
    }
  }

  private applyRewards(activity: Activity): void {
    Object.entries(activity.rewards).forEach(([resource, amount]) => {
      if (amount) {
        this.resourceService.updateResource({
          type: resource as any,
          amount: amount,
          source: activity.name
        });
      }
    });
  }
}