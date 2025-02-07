export interface EventTrigger {
  type: string;
  target: string;
  operator: 'equals' | 'greater' | 'less';
  value: number;
}

export interface EventEffect {
  type: string;
  target: string;
  operator: 'add' | 'subtract' | 'multiply' | 'set';
  value: number;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: EventTrigger[];
  effects: EventEffect[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  trigger: EventTrigger;
  choices: EventChoice[];
}