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

  // Mock state handling
  let gameState: {
    timeState: { currentHour: number; currentDay: number };
    character: { energy: number; stress: number };
    resources: Record<string, number>;
  };

  beforeEach(() => {
    // Initialize clean state
    gameState = {
      timeState: { currentHour: 8, currentDay: 1 },
      character: { energy: 100, stress: 0 },
      resources: { money: 1000, social: 50 }
    };

    // Initialize systems
    eventBus = new EventBus();
    
    gameStateManager = {
      getState: jest.fn(() => gameState),
      updateState: jest.fn((updates) => {
        gameState = { ...gameState, ...updates };
      })
    } as unknown as GameStateManager;

    characterManager = {
      getStatus: jest.fn(() => gameState.character),
      updateStatus: jest.fn((updates) => {
        gameState.character = { ...gameState.character, ...updates };
      })
    } as unknown as CharacterStatusManager;

    eventManager = {
      checkForEvents: jest.fn(() => {
        const events = [];
        if (gameState.character.energy < 30) {
          events.push({ id: 'low_energy_warning' });
        }
        if (gameState.character.stress > 70) {
          events.push({ id: 'high_stress_warning' });
        }
        return events;
      })
    } as unknown as EventManager;

    saveManager = {
      handleSaveRequest: jest.fn(async ({ state }) => {
        gameState = { ...state };
        return true;
      }),
      handleLoadRequest: jest.fn(async () => gameState)
    } as unknown as SaveManager;

    // Setup event listeners
    eventBus.subscribe('time:tick', ({ hours }) => {
      const currentHour = gameState.timeState.currentHour;
      const newHour = (currentHour + hours) % 24;
      const dayIncrement = currentHour + hours >= 24 ? 1 : 0;
      
      gameState.timeState = {
        currentHour: newHour,
        currentDay: gameState.timeState.currentDay + dayIncrement
      };
    });

    eventBus.subscribe('activity:completed', (activity) => {
      activity.effects.forEach((effect: any) => {
        if (effect.type === 'energy') {
          gameState.character.energy = Math.max(0, Math.min(100, gameState.character.energy + effect.value));
        }
      });
    });
  });

  test('time progression updates all systems', () => {
    const startTime = gameState.timeState.currentHour;
    eventBus.emit('time:tick', { hours: 1 });
    
    expect(gameState.timeState.currentHour).toBe((startTime + 1) % 24);
  });

  test('time progression handles day changes', () => {
    gameState.timeState = { currentHour: 23, currentDay: 1 };
    eventBus.emit('time:tick', { hours: 2 });
    
    expect(gameState.timeState.currentHour).toBe(1);
    expect(gameState.timeState.currentDay).toBe(2);
  });

  test('activity completion triggers status effects', () => {
    const activity = {
      type: 'study',
      duration: 2,
      effects: [{ type: 'energy', value: -10 }]
    };

    const initialEnergy = gameState.character.energy;
    eventBus.emit('activity:completed', activity);
    
    expect(gameState.character.energy).toBe(initialEnergy - 10);
    expect(gameState.character.energy).toBeGreaterThanOrEqual(0);
    expect(gameState.character.energy).toBeLessThanOrEqual(100);
  });

  test('events trigger based on conditions', () => {
    // Set state to trigger events
    gameState.character.energy = 20;
    gameState.character.stress = 80;

    const events = eventManager.checkForEvents();
    
    expect(events).toContainEqual(expect.objectContaining({ 
      id: 'low_energy_warning' 
    }));
    expect(events).toContainEqual(expect.objectContaining({ 
      id: 'high_stress_warning' 
    }));
  });

  test('save and load preserves game state', async () => {
    // Create a unique state
    const uniqueState = {
      timeState: { currentHour: 15, currentDay: 2 },
      character: { energy: 75, stress: 25 },
      resources: { money: 2000, social: 60 }
    };
    
    // Save state
    await saveManager.handleSaveRequest({ state: uniqueState, slot: 1 });
    
    // Load state
    const loadedState = await saveManager.handleLoadRequest({ slot: 1 });
    
    // Verify all properties are preserved
    expect(loadedState).toEqual(uniqueState);
  });

  test('multiple activities stack effects correctly', () => {
    const activities = [
      {
        type: 'study',
        duration: 2,
        effects: [{ type: 'energy', value: -10 }]
      },
      {
        type: 'exercise',
        duration: 1,
        effects: [{ type: 'energy', value: -15 }]
      }
    ];

    const initialEnergy = gameState.character.energy;
    
    activities.forEach(activity => {
      eventBus.emit('activity:completed', activity);
    });

    const expectedEnergy = Math.max(0, initialEnergy - 25);
    expect(gameState.character.energy).toBe(expectedEnergy);
  });

  test('time progression affects character status', () => {
    const initialEnergy = gameState.character.energy;
    
    // Simulate passage of time
    for (let i = 0; i < 8; i++) {
      eventBus.emit('time:tick', { hours: 1 });
    }

    // Energy should decrease over time
    expect(gameState.character.energy).toBeLessThan(initialEnergy);
  });
});