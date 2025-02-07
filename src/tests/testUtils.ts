// src/tests/testUtils.ts

import { GameState, Activity, ActivityEffect } from '@/types';
import { EventDisplayProps } from '../types/events';

export const createMockActivity = (override: Partial<Activity> = {}): Activity => ({
  id: 'test-activity',
  name: 'Test Activity',
  type: 'test',
  duration: 1,
  energyCost: 5,
  stressCost: 2,
  effects: [],
  ...override
});

export const createMockEffect = (override: Partial<ActivityEffect> = {}): ActivityEffect => ({
  id: 'test-effect',
  type: 'immediate',
  attribute: 'energy',
  value: 5,
  source: 'test',
  ...override
});

// Update mockEvent to use "consequences" instead of "effects"
// and use proper resource key "socialPoints" instead of "social".
export const mockEvent = (override: Partial<EventDisplayProps> = {}): EventDisplayProps => ({
  id: 'test-event',
  title: 'Test Event',
  description: 'Test event description',
  options: [
    {
      id: 'choice1',
      text: 'Accept',
      consequences: {
        resources: {
          money: -100,
          socialPoints: 10
        }
      }
    },
    {
      id: 'choice2',
      text: 'Decline',
      consequences: {
        resources: {}
      }
    }
  ],
  ...override
});

// Remove explicit type annotation for Resources since it is not exported.
// The returned object will be inferred correctly.
export const mockResources = (override: Partial<{ money: number; knowledgePoints: number; socialPoints: number; energy: number; stress: number }> = {}) => ({
  money: 1000,
  knowledgePoints: 50,
  socialPoints: 25,
  energy: 100,
  stress: 0,
  ...override
});

export class MockEventBus {
  private subscribers: { [key: string]: ((data: any) => void)[] } = {};

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string, data: any) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(data));
    }
  }
}

export const createMockGameState = (override: Partial<GameState> = {}): GameState => ({
  energy: 100,
  stress: 0,
  resources: mockResources(),
  skills: {
    threadLevels: {
      body: 1,
      mind: 1,
      heart: 1,
      world: 1,
      mastery: 1
    },
    skillLevels: {},
    experience: {}
  },
  activities: {
    activeEffects: [],
    history: []
  },
  time: {
    currentDay: 1,
    currentHour: 8,
    totalDays: 1
  },
  lastUpdate: Date.now(),
  ...override
});

export const mockGameState = createMockGameState;

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); }
  };
};

export const expectStateInBounds = (state: GameState) => {
  expect(state.energy).toBeGreaterThanOrEqual(0);
  expect(state.energy).toBeLessThanOrEqual(100);
  expect(state.stress).toBeGreaterThanOrEqual(0);
  expect(state.stress).toBeLessThanOrEqual(100);
  
  Object.values(state.resources).forEach((value) => {
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100000);
  });
};

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

export const advanceTimersByTime = (ms: number) => {
  jest.advanceTimersByTime(ms);
  return flushPromises();
};
