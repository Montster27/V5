import { EventBus } from "../../domain/shared/events";
import { GameTime } from "../../domain/time/types";

export class TimeManager {
  private currentTime: GameTime = { day: 1, hour: 8, minute: 0 };
  private isPaused: boolean = true;
  private accumulatedMs: number = 0;
  private readonly MS_PER_MINUTE = 50; // 1 game day = 3 real seconds

  constructor(private eventBus: EventBus) {}

  getCurrentTime(): GameTime {
    return { ...this.currentTime };
  }

  advance(deltaMs: number): void {
    if (this.isPaused) return;

    this.accumulatedMs += deltaMs;
    while (this.accumulatedMs >= this.MS_PER_MINUTE) {
      this.accumulatedMs -= this.MS_PER_MINUTE;
      this.incrementTime();
    }
  }

  private incrementTime(): void {
    this.currentTime.minute++;
    if (this.currentTime.minute >= 60) {
      this.currentTime.minute = 0;
      this.currentTime.hour++;
      
      // Emit resource updates every hour
      this.eventBus.emit('HOURLY_UPDATE', this.currentTime);
    }

    if (this.currentTime.hour >= 24) {
      this.currentTime.hour = 0;
      this.currentTime.day++;
      
      // Emit daily updates
      this.eventBus.emit('DAILY_UPDATE', this.currentTime);
    }

    this.eventBus.emit('TIME_UPDATED', this.currentTime);
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }
}