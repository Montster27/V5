import { jest } from '@jest/globals';
import { GameEngine } from '../application/GameEngine';
import { store } from '../store/store';
import { updateResources } from '../store/resourceSlice';
import { setCurrentEvent } from '../store/eventSlice';

describe('GameEngine', () => {
  let engine: GameEngine;
  let mockErrorHandler: jest.Mock;
  let mockSetItem: jest.SpyInstance;
  let mockGetItem: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    engine = new GameEngine();
    mockErrorHandler = jest.fn();
    engine.registerErrorHandler(mockErrorHandler);

    // Mock localStorage
    mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
    localStorage.clear();
  });

  afterEach(() => {
    engine.stop();
    jest.clearAllTimers();
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with default state when no saved state exists', () => {
      mockGetItem.mockReturnValue(null);
      
      engine.initialize();
      const state = store.getState();
      
      expect(state.resources.money).toBe(1000);
      expect(state.resources.energy).toBe(100);
      expect(state.resources.stress).toBe(0);
      expect(state.events.currentEvent).toBeNull();

      const engineState = engine.getState();
      expect(engineState.timeState.currentHour).toBe(8); // Default starting hour
      expect(engineState.timeState.currentDay).toBe(1); // Default starting day
    });

    it('should load saved state when it exists', () => {
      const savedState = {
        timeState: {
          currentHour: 12,
          currentDay: 1
        },
        resources: {
          money: 2000,
          energy: 80,
          stress: 20,
        },
        events: {
          currentEvent: null,
          eventHistory: [],
        },
      };
      
      mockGetItem.mockReturnValue(JSON.stringify(savedState));
      
      engine.initialize();
      
      const state = store.getState();
      expect(state.resources.money).toBe(2000);
      expect(state.resources.energy).toBe(80);
      expect(state.resources.stress).toBe(20);
      
      const engineState = engine.getState();
      expect(engineState.timeState.currentHour).toBe(12);
    });
  });

  describe('game loop', () => {
    it('should update resources over time', () => {
      engine.initialize();
      engine.start();
      
      const initialState = store.getState();
      const initialEnergy = initialState.resources.energy;
      const initialStress = initialState.resources.stress;
      
      // Advance time by 1 second
      jest.advanceTimersByTime(1000);
      
      const newState = store.getState();
      expect(newState.resources.energy).toBeLessThan(initialEnergy);
      expect(newState.resources.stress).toBeGreaterThan(initialStress);
    });

    it('should cap resources at their limits', () => {
      engine.initialize();
      engine.start();
      
      // Set energy near minimum and stress near maximum
      store.dispatch(updateResources({ energy: 1, stress: 99 }));
      
      // Advance time significantly
      jest.advanceTimersByTime(5000);
      
      const state = store.getState();
      expect(state.resources.energy).toBe(0);
      expect(state.resources.stress).toBe(100);
    });

    it('should progress time correctly', () => {
      engine.initialize();
      engine.start();
      
      const initialTime = engine.getState().timeState.currentHour;
      
      // Advance 60 real seconds (60 in-game minutes = 1 hour)
      jest.advanceTimersByTime(60 * 1000);
      
      const newTime = engine.getState().timeState.currentHour;
      expect(newTime).toBe((initialTime + 1) % 24);
    });

    it('should handle day transitions', () => {
      engine.initialize();
      engine.start();
      
      // Set time to 23:00
      const savedState = {
        timeState: {
          currentHour: 23,
          currentDay: 1
        },
        resources: store.getState().resources,
        events: store.getState().events
      };
      mockGetItem.mockReturnValue(JSON.stringify(savedState));
      engine.initialize();

      // Advance 60 real seconds to move to next day
      jest.advanceTimersByTime(60 * 1000);
      
      const engineState = engine.getState();
      expect(engineState.timeState.currentHour).toBe(0);
      expect(engineState.timeState.currentDay).toBe(2);
    });
  });

  describe('event system', () => {
    it('should trigger random events over time', () => {
      // Mock Math.random to always trigger events
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockReturnValue(0.005);
      
      engine.initialize();
      engine.start();
      
      // Advance time to allow for event generation
      jest.advanceTimersByTime(1000);
      
      const state = store.getState();
      expect(state.events.currentEvent).not.toBeNull();
      expect(state.events.currentEvent).toHaveProperty('options');
      expect(state.events.currentEvent?.options.length).toBeGreaterThan(0);
      
      mockRandom.mockRestore();
    });

    it('should not trigger new events while one is active', () => {
      const mockEvent = {
        id: 'test',
        title: 'Test Event',
        description: 'Test Description',
        options: [{
          id: 'option1',
          text: 'Test Option'
        }],
      };
      
      store.dispatch(setCurrentEvent(mockEvent));
      
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockReturnValue(0.005);
      
      engine.initialize();
      engine.start();
      
      jest.advanceTimersByTime(1000);
      
      const state = store.getState();
      expect(state.events.currentEvent).toEqual(mockEvent);
      
      mockRandom.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should call error handler when an error occurs', () => {
      const error = new Error('Test error');
      
      // Force an error in the update loop
      jest.spyOn(engine as any, 'update').mockImplementation(() => {
        throw error;
      });
      
      engine.initialize();
      engine.start();
      
      jest.advanceTimersByTime(1000);
      
      expect(mockErrorHandler).toHaveBeenCalled();
      const errorArg = mockErrorHandler.mock.calls[0][0];
      expect(errorArg.message).toBe('Test error');
      expect(errorArg.code).toBe('GAME_ENGINE_ERROR');
    });

    it('should handle localStorage errors gracefully', () => {
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      engine.initialize();
      engine.start();
      
      jest.advanceTimersByTime(5 * 60 * 1000); // Force auto-save
      
      expect(mockErrorHandler).toHaveBeenCalled();
      const errorArg = mockErrorHandler.mock.calls[0][0];
      expect(errorArg.message).toBe('Storage error');
    });
  });

  describe('save system', () => {
    it('should auto-save state periodically', () => {
      engine.initialize();
      engine.start();
      
      // Advance time by 5 minutes
      jest.advanceTimersByTime(5 * 60 * 1000);
      
      expect(mockSetItem).toHaveBeenCalled();
      expect(mockSetItem.mock.calls[0][0]).toBe('mmv_game_state');
      
      // Verify saved state structure
      const savedState = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedState).toHaveProperty('timeState');
      expect(savedState).toHaveProperty('resources');
      expect(savedState).toHaveProperty('events');
    });

    it('should save state on stop', () => {
      engine.initialize();
      engine.start();
      mockSetItem.mockClear(); // Clear previous saves
      
      engine.stop();
      
      expect(mockSetItem).toHaveBeenCalled();
      expect(mockSetItem.mock.calls[0][0]).toBe('mmv_game_state');
      
      const savedState = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedState).toHaveProperty('timeState');
      expect(savedState).toHaveProperty('resources');
      expect(savedState).toHaveProperty('events');
    });

    it('should preserve game state across save/load cycles', () => {
      // Start with a known state
      const initialState = {
        timeState: {
          currentHour: 15,
          currentDay: 2
        },
        resources: {
          money: 5000,
          energy: 75,
          stress: 25
        },
        events: {
          currentEvent: null,
          eventHistory: []
        }
      };

      mockGetItem.mockReturnValue(JSON.stringify(initialState));
      
      engine.initialize();
      engine.start();
      
      // Verify state was loaded correctly
      const loadedState = engine.getState();
      expect(loadedState.timeState.currentHour).toBe(15);
      expect(loadedState.timeState.currentDay).toBe(2);
      expect(loadedState.resources.money).toBe(5000);
      
      // Advance time and verify save
      jest.advanceTimersByTime(5 * 60 * 1000);
      
      const savedStateJson = mockSetItem.mock.calls[0][1];
      const savedState = JSON.parse(savedStateJson);
      
      expect(savedState.timeState.currentDay).toBe(2);
      expect(savedState.resources.money).toBe(5000);
    });
  });
});