import { GameTime, TimeService, TimeState } from '../../domain/time/types';
import { EventBus } from '../../domain/shared/events';

export class TimeManager implements TimeService {
  private state: TimeState;
  private eventBus: EventBus;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.state = {
      gameTime: { day: 1, hour: 8, minute: 0 },
      realMsPerGameMinute: 50,
      isPaused: true
    };
  }

  getCurrentTime(): GameTime {
    return { ...this.state.gameTime };
  }

  setTimeScale(msPerGameMinute: number): void {
    this.state.realMsPerGameMinute = Math.max(1, Math.min(1000, msPerGameMinute));
    this.eventBus.emit('TIME_SCALE_CHANGED', this.state.realMsPerGameMinute);
  }

  pause(): void {
    this.state.isPaused = true;
    this.eventBus.emit('TIME_PAUSED', null);
  }

  resume(): void {
    this.state.isPaused = false;
    this.eventBus.emit('TIME_RESUMED', null);
  }

  advance(deltaMs: number): void {
    if (this.state.isPaused) return;
    
    const gameMinutes = Math.floor(deltaMs / this.state.realMsPerGameMinute);
    if (gameMinutes === 0) return;

    const { day, hour, minute } = this.state.gameTime;
    let newMinute = minute + gameMinutes;
    let newHour = hour;
    let newDay = day;

    if (newMinute >= 60) {
      newHour += Math.floor(newMinute / 60);
      newMinute %= 60;
    }

    if (newHour >= 24) {
      newDay += Math.floor(newHour / 24);
      newHour %= 24;
    }

    this.state.gameTime = { day: newDay, hour: newHour, minute: newMinute };
    this.eventBus.emit('TIME_UPDATED', this.state.gameTime);
  }
}