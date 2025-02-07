export interface TimeState {
  currentDay: number;
  currentHour: number;
  allocatedHours: {
    study: number;
    sleep: number;
    social: number;
    work: number;
    leisure: number;
  };
}

export interface ResourceState {
  money: number;
  energy: number;
  stress: number;
  knowledge: {
    academic: number;
    social: number;
    practical: number;
  };
  social: {
    popularity: number;
    connections: number;
  };
}

export interface CharacterState {
  name: string;
  major: string;
  skills: {
    [key: string]: number;
  };
  status: {
    isRested: boolean;
    isStressed: boolean;
    activeEffects: string[];
  };
}

export interface EventState {
  activeEvent: GameEvent | null;
  eventQueue: GameEvent[];
  completedEvents: string[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  deadline?: number;
  type: 'story' | 'random' | 'academic' | 'social';
}

export interface EventChoice {
  id: string;
  text: string;
  consequences: {
    resources?: Partial<ResourceState>;
    status?: Partial<CharacterState['status']>;
    skills?: { [key: string]: number };
  };
}

export interface RootState {
  time: TimeState;
  resources: ResourceState;
  character: CharacterState;
  events: EventState;
}