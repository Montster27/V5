import { TimeManager } from './time/TimeManager';
import { ResourceManager } from './resources/ResourceManager';
import { EventManager } from './events/EventManager';
import { GameStateManager } from './GameStateManager';
import { EventBusImpl } from '../infrastructure/events/EventBusImpl';
import { GameTime } from '../domain/time/types';
import { Resource } from '../domain/resources/types';
import { EventService } from '../domain/events/EventService';
import { SkillManager } from './skills/SkillManager';

export class GameEngine {
  private lastUpdate: number = 0;
  private running: boolean = false;
  public onTimeUpdate: ((time: GameTime) => void) | null = null;
  public onResourceUpdate: ((resources: Resource[]) => void) | null = null;

  constructor(
    private timeManager: TimeManager,
    private resourceManager: ResourceManager,
    private eventManager: EventManager,
    private stateManager: GameStateManager,
    private eventBus: EventBusImpl,
    private skillManager: SkillManager
  ) {
    this.eventBus.subscribe('TIME_UPDATED', (time: GameTime) => {
      if (this.onTimeUpdate) this.onTimeUpdate(time);
    });

    this.eventBus.subscribe('RESOURCE_UPDATED', () => {
      if (this.onResourceUpdate) {
        this.onResourceUpdate(this.resourceManager.getState());
      }
    });
  }

  static create(): GameEngine {
    const eventBus = new EventBusImpl();
    const timeManager = new TimeManager(eventBus);
    const resourceManager = new ResourceManager(eventBus);
    const eventService = new EventService();
    const skillManager = new SkillManager(eventBus);
    const stateManager = new GameStateManager(
      timeManager,
      resourceManager,
      eventBus
    );

    const eventManager = new EventManager(
      eventService,
      resourceManager,
      skillManager,
      stateManager,
      eventBus
    );

    return new GameEngine(timeManager, resourceManager, eventManager, stateManager, eventBus, skillManager);
  }

  start(): void {
    this.timeManager.resume();
    this.running = true;
    this.lastUpdate = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.timeManager.pause();
    this.running = false;
  }

  private gameLoop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const deltaMs = now - this.lastUpdate;
    this.lastUpdate = now;

    this.timeManager.advance(deltaMs);
    this.eventManager.checkForEvents();

    requestAnimationFrame(this.gameLoop);
  }
}