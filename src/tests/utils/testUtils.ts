import { jest } from '@jest/globals';

export const mockEvent = {
  id: 'test-event',
  title: 'Test Event',
  description: 'This is a test event',
  choices: [
    { id: 'choice1', text: 'Accept', effects: { money: -100, social: 10 } },
    { id: 'choice2', text: 'Decline', effects: { social: -5 } }
  ],
  timeLimit: 30
};

export const mockResources = {
  money: 1000,
  social: 50,
  knowledge: 30,
  energy: 100,
  stress: 0
};

export class MockEventBus {
  private listeners: Record<string, Function[]> = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

export const createMockGameState = () => ({
  resources: { ...mockResources },
  events: {
    current: null,
    history: []
  },
  skills: {
    BODY: 1,
    MIND: 1,
    HEART: 1,
    WORLD: 1,
    MASTERY: 1
  },
  timeState: {
    currentHour: 0,
    currentDay: 1,
    lastUpdate: Date.now()
  }
});

export const renderWithAct = async (component: React.ReactElement) => {
  const { act } = await import('@testing-library/react');
  await act(async () => {
    const { render } = await import('@testing-library/react');
    render(component);
  });
};

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));