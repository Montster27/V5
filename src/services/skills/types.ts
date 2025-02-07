export interface SkillNode {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  thread: LifeThread;
  xp: number;
  level: number;
  unlocked: boolean;
  prerequisites: string[];
  decayRate: number;
  lastUsed: number;
}

export enum LifeThread {
  BODY = 'body',
  MIND = 'mind',
  HEART = 'heart',
  WORLD = 'world',
  MASTERY = 'mastery'
}

export interface SkillState {
  nodes: Record<string, SkillNode>;
  activeNodes: string[];
  threadLevels: Record<LifeThread, number>;
  totalXP: number;
}

export interface ActivitySkillEffect {
  skillId: string;
  xpGain: number;
  conditions?: {
    minEnergy?: number;
    maxStress?: number;
  };
}