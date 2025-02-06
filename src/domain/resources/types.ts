export type ResourceType = 'energy' | 'stress' | 'money' | 'knowledge' | 'social';

export interface ResourceState {
  energy: number;
  stress: number;
  money: number;
  knowledge: number;
  social: number;
}

export interface ResourceUpdate {
  type: ResourceType;
  amount: number;
  source: string;
}

export interface ResourceModifier {
  type: ResourceType;
  multiplier: number;
  duration: number;
  source: string;
}

export interface ResourceLimits {
  min: number;
  max: number;
  default: number;
}

export const RESOURCE_LIMITS: Record<ResourceType, ResourceLimits> = {
  energy: { min: 0, max: 100, default: 100 },
  stress: { min: 0, max: 100, default: 0 },
  money: { min: 0, max: 100000, default: 1000 },
  knowledge: { min: 0, max: 100000, default: 0 },
  social: { min: 0, max: 100000, default: 0 }
};