import { SkillState, SkillNode, LifeThread } from './types';

export class SkillSystemService {
  private static readonly XP_PER_LEVEL = 100;
  private static readonly DECAY_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_ACTIVE_SKILLS = 5;
  
  static initializeSkillWeb(): SkillState {
    return {
      nodes: this.generateInitialNodes(),
      activeNodes: [],
      threadLevels: {
        [LifeThread.BODY]: 1,
        [LifeThread.MIND]: 1,
        [LifeThread.HEART]: 1,
        [LifeThread.WORLD]: 1,
        [LifeThread.MASTERY]: 1
      },
      totalXP: 0
    };
  }
  
  static addXP(state: SkillState, nodeId: string, amount: number): SkillState {
    const node = state.nodes[nodeId];
    if (!node || !node.unlocked) return state;
    
    const newXP = node.xp + amount;
    const newLevel = Math.floor(newXP / this.XP_PER_LEVEL);
    
    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...node,
          xp: newXP,
          level: newLevel,
          lastUsed: Date.now()
        }
      },
      totalXP: state.totalXP + amount
    };
  }
  
  static applySkillDecay(state: SkillState): SkillState {
    const now = Date.now();
    const updatedNodes = Object.entries(state.nodes).reduce(
      (acc, [id, node]) => {
        if (!node.unlocked) return { ...acc, [id]: node };
        
        const timeSinceUse = now - node.lastUsed;
        const decayPeriods = Math.floor(timeSinceUse / this.DECAY_INTERVAL);
        const decayAmount = decayPeriods * node.decayRate;
        
        const newXP = Math.max(0, node.xp - decayAmount);
        const newLevel = Math.floor(newXP / this.XP_PER_LEVEL);
        
        return {
          ...acc,
          [id]: {
            ...node,
            xp: newXP,
            level: newLevel
          }
        };
      },
      {}
    );
    
    return {
      ...state,
      nodes: updatedNodes
    };
  }
  
  static canUnlockNode(state: SkillState, nodeId: string): boolean {
    const node = state.nodes[nodeId];
    if (!node || node.unlocked) return false;
    
    // Check prerequisites
    const prereqsMet = node.prerequisites.every(prereqId => {
      const prereq = state.nodes[prereqId];
      return prereq && prereq.unlocked && prereq.level >= 1;
    });
    
    // Check thread level requirements
    const threadLevelMet = state.threadLevels[node.thread] >= node.tier;
    
    return prereqsMet && threadLevelMet;
  }
  
  static unlockNode(state: SkillState, nodeId: string): SkillState {
    if (!this.canUnlockNode(state, nodeId)) return state;
    
    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          unlocked: true,
          lastUsed: Date.now()
        }
      }
    };
  }
  
  private static generateInitialNodes(): Record<string, SkillNode> {
    // Implementation would populate with all skill nodes from data
    return {};
  }
  
  static calculateThreadLevel(nodes: Record<string, SkillNode>, thread: LifeThread): number {
    const threadNodes = Object.values(nodes).filter(
      node => node.thread === thread && node.unlocked
    );
    
    const totalLevels = threadNodes.reduce((sum, node) => sum + node.level, 0);
    return Math.floor(totalLevels / threadNodes.length) || 1;
  }
}