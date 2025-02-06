import { GameState, ScheduledActivity } from './types';

export class GameStateService {
  constructor(private state: GameState) {}

  updateTime(delta: number): void {
    const newHour = this.state.timeState.currentHour + delta;
    this.state.timeState.currentHour = newHour % 24;
    this.state.timeState.currentDay += Math.floor(newHour / 24);
  }

  scheduleActivity(activity: ScheduledActivity): void {
    if (this.checkActivityConflict(activity)) {
      throw new Error('Activity time conflict');
    }
    this.state.activityState.scheduledActivities.push(activity);
  }

  private checkActivityConflict(activity: ScheduledActivity): boolean {
    return this.state.activityState.scheduledActivities.some(scheduled => {
      const scheduledEnd = scheduled.startTime + scheduled.duration;
      const newEnd = activity.startTime + activity.duration;
      return (activity.startTime < scheduledEnd && newEnd > scheduled.startTime);
    });
  }

  updateCharacterState(energy: number, stress: number, belonging: number, health: number): void {
    Object.assign(this.state.characterState, {
      energy: Math.max(0, Math.min(100, energy)),
      stress: Math.max(0, Math.min(100, stress)),
      belonging: Math.max(0, Math.min(100, belonging)),
      health: Math.max(0, Math.min(100, health))
    });
  }

  addCompletedEvent(eventId: string): void {
    if (!this.state.worldState.completedEvents.includes(eventId)) {
      this.state.worldState.completedEvents.push(eventId);
    }
  }

  getState(): GameState {
    return { ...this.state };
  }
}