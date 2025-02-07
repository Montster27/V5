export interface AllocatedHours {
  study: number;
  sleep: number;
  social: number;
  work: number;
  leisure: number;
}

export interface TimeState {
  // Core time tracking
  currentDay: number;
  currentHour: number;
  allocatedHours: AllocatedHours;
  
  // Game flow control
  isPaused: boolean;
  speed: number;

  // Date conversion
  currentDate: Date;
  getCurrentDate: () => Date;

  // Control methods
  start: () => void;
  pause: () => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  resetDay: () => void;
}

export interface TimeUpdate {
  delta: number;  // Time passed since last update in milliseconds
  currentHour: number;
  currentDay: number;
}

export const HOURS_PER_DAY = 24;
export const MIN_SLEEP_HOURS = 1;
export const MAX_STUDY_HOURS = 20;
export const DEFAULT_GAME_SPEED = 1;
export const MAX_GAME_SPEED = 3;

// Time periods - useful for events and scheduling
export enum TimePeriod {
  EARLY_MORNING = 'EARLY_MORNING',   // 5-8
  MORNING = 'MORNING',               // 8-12
  AFTERNOON = 'AFTERNOON',           // 12-17
  EVENING = 'EVENING',               // 17-21
  NIGHT = 'NIGHT',                   // 21-24
  LATE_NIGHT = 'LATE_NIGHT'          // 0-5
}

export function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 8) return TimePeriod.EARLY_MORNING;
  if (hour >= 8 && hour < 12) return TimePeriod.MORNING;
  if (hour >= 12 && hour < 17) return TimePeriod.AFTERNOON;
  if (hour >= 17 && hour < 21) return TimePeriod.EVENING;
  if (hour >= 21 && hour < 24) return TimePeriod.NIGHT;
  return TimePeriod.LATE_NIGHT;
}

export function formatGameDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatGameTime(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

export function isValidTimeAllocation(allocatedHours: AllocatedHours): boolean {
  const totalHours = Object.values(allocatedHours).reduce((sum, hours) => sum + hours, 0);
  return (
    totalHours === HOURS_PER_DAY &&
    allocatedHours.sleep >= MIN_SLEEP_HOURS &&
    allocatedHours.study <= MAX_STUDY_HOURS
  );
}