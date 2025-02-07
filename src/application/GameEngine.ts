import { store } from '../store/store';
import { updateResources, resetResources } from '../store/resourceSlice';
import { setCurrentEvent, resetEvents } from '../store/eventSlice';
import { GameError } from '../types/game';
import { EventDisplayProps } from '../types/events';

export class GameEngine {
  private errorHandler: ((error: Error) => void) | null = null;
  private isRunning: boolean = false;
  private gameLoop: number | null = null;
  private lastUpdate: number = 0;
  private lastAutoSave: number = 0;
  private readonly SAVE_KEY = 'mmv_game_state';
  private readonly AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly UPDATE_INTERVAL = 1000 / 60; // 60 FPS
  private timeState = { currentHour: 8, currentDay: 1 };

  initialize() {
    try {
      const now = Date.now();
      this.lastUpdate = now;
      this.lastAutoSave = now;
      this.loadGameState();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  create() {
    try {
      this.setupInitialState();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    const now = Date.now();
    this.lastUpdate = now;
    this.lastAutoSave = now;
    
    this.gameLoop = window.setInterval(() => {
      try {
        this.update();
      } catch (error) {
        this.handleError(error as Error);
      }
    }, this.UPDATE_INTERVAL);
  }

  stop() {
    if (!this.isRunning) return;
    
    if (this.gameLoop) {
      window.clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.isRunning = false;
    
    // Save state when stopping
    this.saveGameState();
  }

  registerErrorHandler(handler: (error: Error) => void) {
    this.errorHandler = handler;
  }

  onRestart() {
    this.stop();
    store.dispatch(resetResources());
    store.dispatch(resetEvents());
    this.initialize();
    this.create();
    this.start();
  }

  getState() {
    return {
      timeState: this.timeState,
      resources: store.getState().resources,
      events: store.getState().events
    };
  }

  private update() {
    const currentTime = Date.now();
    const delta = (currentTime - this.lastUpdate) / 1000; // Convert to seconds
    this.lastUpdate = currentTime;

    // Update game time
    this.updateGameTime(delta);

    // Update game systems
    this.updateResources(delta);
    this.processEvents();
    
    // Check for auto-save
    if (currentTime - this.lastAutoSave >= this.AUTO_SAVE_INTERVAL) {
      this.saveGameState();
      this.lastAutoSave = currentTime;
    }
  }

  private timeAccumulator: number = 0;

  private updateGameTime(delta: number) {
    // Each real second represents 1 minute in game.
    // Accumulate delta (in seconds) as game minutes.
    this.timeAccumulator += delta;
    if (this.timeAccumulator >= 60) {
      const hoursToAdd = Math.floor(this.timeAccumulator / 60);
      this.timeAccumulator %= 60;
      const totalHours = this.timeState.currentHour + hoursToAdd;
      this.timeState.currentHour = totalHours % 24;
      this.timeState.currentDay += Math.floor(totalHours / 24);
    }
  }

  private updateResources(delta: number) {
    const state = store.getState();
    const resources = state.resources;

    // Calculate new resource values
    const newEnergy = Math.max(0, Math.min(100, resources.energy - (2 * delta)));
    const newStress = Math.max(0, Math.min(100, resources.stress + (1 * delta)));

    // Only dispatch if values have changed
    if (newEnergy !== resources.energy || newStress !== resources.stress) {
      store.dispatch(updateResources({
        energy: newEnergy,
        stress: newStress,
      }));
    }
  }

  private processEvents() {
    const state = store.getState();
    if (!state.events.currentEvent) {
      // Chance to trigger new event
      if (Math.random() < 0.01) { // 1% chance per update
        this.triggerRandomEvent();
      }
    }
  }

  private triggerRandomEvent() {
    const event: EventDisplayProps = {
      id: 'test_event',
      title: 'Random Encounter',
      description: 'Something interesting happens!',
      options: [
        {
          id: 'option1',
          text: 'Accept the challenge',
          consequences: {
            resources: {
              energy: -10,
              stress: 5,
            }
          }
        },
        {
          id: 'option2',
          text: 'Decline and rest',
          consequences: {
            resources: {
              energy: 5,
              stress: -5,
            }
          }
        }
      ]
    };
    
    store.dispatch(setCurrentEvent(event));
  }

  private handleError(error: Error) {
    const gameError: GameError = {
      name: error.name,
      message: error.message,
      code: 'GAME_ENGINE_ERROR',
      stack: error.stack,
    };

    if (this.errorHandler) {
      this.errorHandler(gameError);
    } else {
      console.error('Unhandled game error:', gameError);
    }
  }

  private loadGameState() {
    try {
      const savedState = localStorage.getItem(this.SAVE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Load time state if it exists
        if (parsedState.timeState) {
          this.timeState = parsedState.timeState;
        }

        // Load resources
        if (parsedState.resources) {
          store.dispatch(updateResources(parsedState.resources));
        }

        // Load events
        if (parsedState.events?.currentEvent) {
          store.dispatch(setCurrentEvent(parsedState.events.currentEvent));
        }
      } else {
        this.setupInitialState();
      }
    } catch (error) {
      console.warn('Failed to load saved game state:', error);
      this.setupInitialState();
    }
  }

  private saveGameState() {
    try {
      const state = store.getState();
      const savedState = {
        timeState: this.timeState,
        resources: state.resources,
        events: {
          currentEvent: state.events.currentEvent,
          eventHistory: state.events.eventHistory
        }
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(savedState));
    } catch (error) {
      console.error('Failed to save game state:', error);
      this.handleError(error as Error);
    }
  }

  private setupInitialState() {
    // Reset time state
    this.timeState = {
      currentHour: 8,
      currentDay: 1
    };

    // Reset Redux state
    store.dispatch(resetResources());
    store.dispatch(resetEvents());
  }
}
