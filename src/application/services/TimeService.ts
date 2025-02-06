import { GameDate, TimeState, MILLISECONDS_PER_GAME_DAY } from '../../domain/time/types';
import { eventBus } from '../../infrastructure/events/EventBus';

export class TimeService {
  private state: TimeState;
  private lastTick: number;
  private tickInterval: number | null = null;

  constructor(startDate: Date = new Date(1983, 0, 1)) {
    this.state = {
      currentDate: this.dateToGameDate(startDate),
      speed: 1,
      isPaused: true
    };
    this.lastTick = Date.now();
  }

  start(): void {
    if (!this.tickInterval) {
      this.lastTick = Date.now();
      this.state.isPaused = false;
      this.tickInterval = window.setInterval(() => this.tick(), 100);
    }
  }

  pause(): void {
    if (this.tickInterval) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = null;
      this.state.isPaused = true;
    }
  }

  setSpeed(speed: number): void {
    this.state.speed = Math.max(0, Math.min(speed, 10));
  }

  private tick(): void {
    const now = Date.now();
    const elapsed = now - this.lastTick;
    const gameDaysElapsed = (elapsed * this.state.speed) / MILLISECONDS_PER_GAME_DAY;
    
    if (gameDaysElapsed >= 1) {
      this.advanceDays(Math.floor(gameDaysElapsed));
      this.lastTick = now;
    }
  }

  private advanceDays(days: number): void {
    const date = this.gameDateToDate(this.state.currentDate);
    date.setDate(date.getDate() + days);
    this.state.currentDate = this.dateToGameDate(date);

    eventBus.publish('DAY_PASSED', {
      type: 'DAY_PASSED',
      currentDate: this.gameDateToDate(this.state.currentDate)
    });
  }

  private dateToGameDate(date: Date): GameDate {
    return {
      timestamp: date.getTime(),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    };
  }

  private gameDateToDate(gameDate: GameDate): Date {
    return new Date(gameDate.year, gameDate.month, gameDate.day);
  }

  getCurrentDate(): Date {
    return this.gameDateToDate(this.state.currentDate);
  }

  getState(): TimeState {
    return { ...this.state };
  }
}