// /Users/montysharma/Documents/V5/mmv_clean/src/application/GameEngine.ts

import { GameStateManager } from './GameStateManager';
import { EventManager } from './events/EventManager';
import { TimeState } from '../domain/time/TimeState';
import { GameError } from '../domain/shared/GameError';

export class GameEngine {
  private gameStateManager!: GameStateManager;
  private eventManager!: EventManager;
  private timeState!: TimeState;
  private isInitialized: boolean = false;
  private errorHandlers: ((error: GameError) => void)[] = [];

  constructor() {
    this.initializeManagers();
  }

  private initializeManagers(): void {
    try {
      this.gameStateManager = new GameStateManager();
      this.eventManager = new EventManager();
    } catch (error) {
      this.handleError(new GameError(
        'Failed to initialize game engine',
        'ENGINE_INIT_ERROR',
        'fatal',
        { originalError: error }
      ));
    }
  }

  public registerErrorHandler(handler: (error: GameError) => void): void {
    this.errorHandlers.push(handler);
  }

  private handleError(error: GameError): void {
    console.error(`[GameEngine] ${error.code}:`, error.message, error.context);
    this.errorHandlers.forEach(handler => handler(error));
    
    if (error.severity === 'fatal') {
      this.stop();
    }
  }

  public create(): void {
    try {
      if (!this.gameStateManager) {
        throw new GameError(
          'Game state manager not initialized',
          'STATE_MANAGER_ERROR',
          'fatal'
        );
      }
      this.gameStateManager.initialize();
    } catch (error) {
      this.handleError(new GameError(
        'Failed to create game systems',
        'CREATE_ERROR',
        'fatal',
        { originalError: error }
      ));
    }
  }

  public start(): void {
    try {
      if (!this.isInitialized) {
        throw new GameError(
          'Game engine not initialized',
          'NOT_INITIALIZED',
          'error'
        );
      }
      this.timeState.start();
    } catch (error) {
      this.handleError(new GameError(
        'Failed to start game',
        'START_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }

  public stop(): void {
    try {
      this.timeState?.pause();
    } catch (error) {
      this.handleError(new GameError(
        'Failed to stop game',
        'STOP_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }

  public initialize(timeState: TimeState): void {
    try {
      if (!timeState) {
        throw new GameError(
          'Invalid time state provided',
          'INVALID_TIME_STATE',
          'fatal'
        );
      }
      this.timeState = timeState;
      this.gameStateManager.initialize();
      this.isInitialized = true;
    } catch (error) {
      this.handleError(new GameError(
        'Failed to initialize game engine',
        'INIT_ERROR',
        'fatal',
        { originalError: error }
      ));
    }
  }

  public update(delta: number): void {
    try {
      if (!this.isInitialized) {
        throw new GameError(
          'Game engine not initialized',
          'UPDATE_ERROR',
          'error'
        );
      }

      if (!this.timeState.isPaused) {
        this.gameStateManager.update(delta);
        this.eventManager.checkForEvents();
      }
    } catch (error) {
      this.handleError(new GameError(
        'Error during game update',
        'UPDATE_ERROR',
        'error',
        { originalError: error, delta }
      ));
    }
  }

  public setSpeed(speed: number): void {
    try {
      if (speed < 0 || speed > 3) {
        throw new GameError(
          'Invalid game speed',
          'INVALID_SPEED',
          'warning',
          { speed }
        );
      }
      this.timeState.setSpeed(speed);
    } catch (error) {
      this.handleError(new GameError(
        'Failed to set game speed',
        'SPEED_ERROR',
        'warning',
        { originalError: error, speed }
      ));
    }
  }
}