// src/types/index.ts

export interface GameState {
  energy: number;
  stress: number;
  resources: ResourceState;
  skills: SkillState;
  activities: ActivityState;
  time: TimeState;
  lastUpdate: number;
}

export interface ResourceState {
  knowledgePoints: number;
  money: number;
  socialPoints: number;
}

export interface TimeState {
  currentDay: number;
  currentHour: number;
  totalDays: number;
}

export interface ActivityState {
  currentActivity?: Activity;
  activeEffects: ActivityEffect[];
  history: ActivityHistoryEntry[];
}

export enum LifeThread {
  BODY = 'body',
  MIND = 'mind',
  HEART = 'heart',
  WORLD = 'world',
  MASTERY = 'mastery'
}

export interface SkillState {
  threadLevels: Record<LifeThread, number>;
  skillLevels: Record<string, number>;
  experience: Record<string, number>;
}

export interface ActivityEffect {
  id: string;
  type: 'duration' | 'immediate';
  attribute: string;
  value: number;
  duration?: number;
  source: string;
}

export interface ActivityHistoryEntry {
  activityId: string;
  startTime: number;
  duration: number;
  effects: ActivityEffect[];
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
  energyCost: number;
  stressCost: number;
  effects: ActivityEffect[];
  requirements?: ActivityRequirement[];
}

export interface ActivityRequirement {
  type: 'skill' | 'resource' | 'time';
  target: string;
  value: number;
}