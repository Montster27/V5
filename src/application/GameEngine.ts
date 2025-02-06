import { EventBusImpl } from '../infrastructure/events/EventBusImpl';
import { TimeManager } from './time/TimeManager';
import { ResourceManager } from './resources/ResourceManager';
import { EventManager } from './events/EventManager';
import { LocalStorageSaveService } from '../infrastructure/persistence/LocalStorageSaveService';
import { GameStateManager } from './GameStateManager';

export class GameEngine {
  private lastUpdate: number = 0;
  private running: boolean = false;

  constructor(
    private timeManager: TimeManager,
    private resourceManager: ResourceManager,
    private eventManager: EventManager,
    private stateManager: GameStateManager
  ) {}

  static create(): GameEngine {
    const eventBus = new EventBusImpl();
    const timeManager = new TimeManager(eventBus);
    const resourceManager = new ResourceManager(eventBus);
    const eventManager = new EventManager(eventBus, resourceManager);
    const saveService = new LocalStorageSaveService();
    const stateManager = new GameStateManager(
      timeManager,
      resourceManager,
      eventManager,
      saveService,
      eventBus
    );

    return new GameEngine(timeManager, resourceManager, eventManager, stateManager);
  }

  start(): void {
    this.running = true;
    this.lastUpdate = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.running = false;
  }

  private gameLoop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const deltaMs = now - this.lastUpdate;
    this.lastUpdate = now;

    // Update game state
    this.timeManager.advance(deltaMs);
    this.eventManager.checkScheduledEvents(this.timeManager.getCurrentTime());

    requestAnimationFrame(this.gameLoop);
  }
}