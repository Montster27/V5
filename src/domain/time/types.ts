export interface GameTime {
  day: number;
  hour: number;
  minute: number;
}

export interface GameDate {
  timestamp: number;
  day: number;
  month: number;
  year: number;
}

export interface TimeState {
  currentDate: GameDate;
  speed: number;
  isPaused: boolean;
}

export const MILLISECONDS_PER_GAME_DAY = 3000; // 3 seconds per game day