// /Users/montysharma/Documents/V5/mmv_clean/src/domain/time/TimeState.ts

export interface TimeState {
  currentDate: Date;
  isPaused: boolean;
  speed: number;
  start: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  getCurrentDate: () => Date;
  togglePause: () => void;
}