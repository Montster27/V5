export type EventCategory = 'daily' | 'pivotal' | 'mystery';

export interface GameEvent {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  triggerConditions: TriggerCondition[];
  choices: EventChoice[];
  effects: EventEffect[];
}

export interface TriggerCondition {
  type: 'resource' | 'skill' | 'time' | 'state';
  target: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: TriggerCondition[];
  effects: EventEffect[];
}

export interface EventEffect {
  type: 'resource' | 'skill' | 'state';
  target: string;
  value: number;
  operator: 'add' | 'subtract' | 'set' | 'multiply';
}