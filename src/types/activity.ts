export type ActivityEffectType = 'duration' | 'immediate';

export interface ActivityEffect {
  id: string;
  type: ActivityEffectType;
  effects: Effect[];
}

export interface Effect {
  type: string;
  attribute: string;
  value: number;
  duration: number;
  source: string;
}

export interface ActivityState {
  id: string;
  type: ActivityEffectType;
  effects: Effect[];
}