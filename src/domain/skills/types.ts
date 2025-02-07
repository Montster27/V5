// src/domain/skills/types.ts

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
  activeEffects: SkillEffect[];
}

export interface SkillEffect {
  id: string;
  threadId: LifeThread;
  modifier: number;
  duration: number;
  source: string;
}

export interface SkillModifiers {
  threadModifiers: Record<LifeThread, number>;
  skillModifiers: Record<string, number>;
}

export interface SkillLevelRequirement {
  thread: LifeThread;
  level: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  thread: LifeThread;
  description: string;
  requirements: SkillLevelRequirement[];
  maxLevel: number;
  baseExpPerLevel: number;
}

export interface SkillProgress {
  currentLevel: number;
  experience: number;
  nextLevelExperience: number;
}