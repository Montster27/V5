import { GameState } from '../domain/game/types';
import { CharacterState } from '../domain/game/types';

export const createMockGameState = (): GameState => ({
  timeState: {
    currentDay: 1,
    currentHour: 8,
    timeScale: 1
  },
  characterState: {
    energy: 100,
    stress: 0,
    belonging: 50,
    health: 100
  },
  worldState: {
    discoveredLocations: [],
    unlockedEvents: [],
    completedEvents: [],
    relationships: []
  },
  activityState: {
    scheduledActivities: [],
    completedActivities: []
  }
});

export const createMockCharacterState = (overrides: Partial<CharacterState> = {}): CharacterState => ({
  energy: 100,
  stress: 0,
  belonging: 50,
  health: 100,
  ...overrides
});

export class MockEventBus {
  private handlers: Map<string, Function[]> = new Map();

  emit(event: string, data: any) {
    const eventHandlers = this.handlers.get(event) || [];
    eventHandlers.forEach(handler => handler(data));
  }

  subscribe(event: string, handler: Function) {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  unsubscribe(event: string, handler: Function) {
    const handlers = this.handlers.get(event) || [];
    this.handlers.set(event, handlers.filter(h => h !== handler));
  }
}