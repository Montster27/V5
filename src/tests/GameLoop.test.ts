import { EventBus } from '../application/EventBus';
import { GameStateManager } from '../application/game/GameStateManager';
import { CharacterStatusManager } from '../application/character/CharacterStatusManager';
import { EventManager } from '../application/events/EventManager';
import { SaveManager } from '../application/persistence/SaveManager';

describe('Game Loop Integration', () => {
  let eventBus: EventBus;
  let gameStateManager: GameStateManager;
  let characterManager: CharacterStatusManager;
  let eventManager: EventManager;
  let saveManager: SaveManager;

  beforeEach(() => {
    eventBus = new EventBus();
    // Initialize managers with test configurations
  });

  test('time progression updates all systems', () => {
    const startTime = gameStateManager.getState().timeState.currentHour;
    eventBus.emit('time:tick', 1);
    
    const endTime = gameStateManager.getState().timeState.currentHour;
    expect(endTime).toBe((startTime + 1) % 24);
  });

  test('activity completion triggers status effects', () => {
    const activity = {
      type: 'study',
      duration: 2,
      effects: [{ type: 'energy', value: -10 }]
    };

    eventBus.emit('activity:completed', activity);
    const status = characterManager.getStatus();
    expect(status.energy).toBeLessThan(100);
  });

  test('events trigger based on conditions', () => {
    const testState = {
      energy: 20,
      stress: 80
    };

    eventBus.emit('character:status:updated', { status: testState });
    const events = eventManager.checkForEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  test('save and load preserves game state', async () => {
    const originalState = gameStateManager.getState();
    await saveManager.handleSaveRequest({ state: originalState, slot: 1 });
    
    const loadedState = await saveManager.handleLoadRequest({ slot: 1 });
    expect(loadedState).toEqual(originalState);
  });
});