export interface GameState {
  timeState: TimeState;
  characterState: CharacterState;
  worldState: WorldState;
  activityState: ActivityState;
}

export interface TimeState {
  currentDay: number;
  currentHour: number;
  timeScale: number;  // 1 day per 3 seconds
}

export interface CharacterState {
  energy: number;
  stress: number;
  belonging: number;
  health: number;
}

export interface WorldState {
  discoveredLocations: string[];
  unlockedEvents: string[];
  completedEvents: string[];
  relationships: Relationship[];
}

export interface ActivityState {
  currentActivity?: string;
  scheduledActivities: ScheduledActivity[];
  completedActivities: string[];
}

export interface Relationship {
  npcId: string;
  level: number;
  trust: number;
  lastInteraction: number;
}

export interface ScheduledActivity {
  id: string;
  activityType: string;
  startTime: number;
  duration: number;
  location: string;
}