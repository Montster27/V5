// /Users/montysharma/Documents/V5/mmv_clean/src/domain/events/EventService.ts

import { GameEvent, ActivityEvent, StatusChangeEvent, MilestoneEvent } from './EventTypes';

export class EventService {
  private static readonly MAX_EVENTS = 100;
  private events: GameEvent[] = [];

  addActivityEvent(
    activityType: 'rest' | 'study' | 'work' | 'social',
    duration: number,
    energyImpact: number,
    stressImpact: number
  ): ActivityEvent {
    const event: ActivityEvent = {
      id: crypto.randomUUID(),
      type: 'ACTIVITY',
      timestamp: Date.now(),
      title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Activity`,
      description: this.generateActivityDescription(activityType, duration, energyImpact, stressImpact),
      severity: this.calculateActivitySeverity(energyImpact, stressImpact),
      metadata: {
        activityType,
        duration,
        energyImpact,
        stressImpact
      }
    };

    this.addEvent(event);
    return event;
  }

  addStatusChangeEvent(
    statusType: 'energy' | 'stress',
    oldValue: number,
    newValue: number,
    reason: string
  ): StatusChangeEvent {
    const event: StatusChangeEvent = {
      id: crypto.randomUUID(),
      type: 'STATUS_CHANGE',
      timestamp: Date.now(),
      title: `${statusType.charAt(0).toUpperCase() + statusType.slice(1)} Level Change`,
      description: this.generateStatusChangeDescription(statusType, oldValue, newValue, reason),
      severity: this.calculateStatusChangeSeverity(statusType, oldValue, newValue),
      metadata: {
        statusType,
        oldValue,
        newValue,
        reason
      }
    };

    this.addEvent(event);
    return event;
  }

  addMilestoneEvent(milestoneType: string, achievement: string): MilestoneEvent {
    const event: MilestoneEvent = {
      id: crypto.randomUUID(),
      type: 'MILESTONE',
      timestamp: Date.now(),
      title: 'Achievement Unlocked',
      description: achievement,
      severity: 'info',
      metadata: {
        milestoneType,
        achievement
      }
    };

    this.addEvent(event);
    return event;
  }

  getRecentEvents(limit: number = 10): GameEvent[] {
    return this.events.slice(-limit).reverse();
  }

  clearEvents(): void {
    this.events = [];
  }

  private addEvent(event: GameEvent): void {
    this.events.push(event);
    if (this.events.length > EventService.MAX_EVENTS) {
      this.events.shift();
    }
  }

  private generateActivityDescription(
    activityType: string,
    duration: number,
    energyImpact: number,
    stressImpact: number
  ): string {
    const energyText = energyImpact > 0 ? `gained ${energyImpact}` : `lost ${Math.abs(energyImpact)}`;
    const stressText = stressImpact > 0 ? `increased by ${stressImpact}` : `decreased by ${Math.abs(stressImpact)}`;
    return `Spent ${duration} hours on ${activityType}. Energy ${energyText}, Stress ${stressText}.`;
  }

  private generateStatusChangeDescription(
    statusType: string,
    oldValue: number,
    newValue: number,
    reason: string
  ): string {
    const change = newValue - oldValue;
    const direction = change > 0 ? 'increased' : 'decreased';
    return `${statusType.charAt(0).toUpperCase() + statusType.slice(1)} ${direction} by ${Math.abs(change)} due to ${reason}.`;
  }

  private calculateActivitySeverity(
    energyImpact: number,
    stressImpact: number
  ): 'info' | 'warning' | 'critical' {
    if (energyImpact < -30 || stressImpact > 30) return 'critical';
    if (energyImpact < -20 || stressImpact > 20) return 'warning';
    return 'info';
  }

  private calculateStatusChangeSeverity(
    statusType: string,
    oldValue: number,
    newValue: number
  ): 'info' | 'warning' | 'critical' {
    const change = newValue - oldValue;
    if (statusType === 'energy' && change < -30) return 'critical';
    if (statusType === 'stress' && change > 30) return 'critical';
    if (statusType === 'energy' && change < -20) return 'warning';
    if (statusType === 'stress' && change > 20) return 'warning';
    return 'info';
  }
}