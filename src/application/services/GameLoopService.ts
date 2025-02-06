import { TimeService } from './TimeService';
import { ResourceService } from './ResourceService';
import { eventBus } from '../../infrastructure/events/EventBus';

export class GameLoopService {
  private timeService: TimeService;
  private resourceService: ResourceService;

  constructor() {
    this.timeService = new TimeService();
    this.resourceService = new ResourceService();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    eventBus.subscribe('DAY_PASSED', () => {
      this.updateDailyResources();
    });
  }

  private updateDailyResources(): void {
    // Base resource changes per day
    this.resourceService.updateResource({
      type: 'energy',
      amount: -5,
      source: 'daily-drain'
    });

    this.resourceService.updateResource({
      type: 'money',
      amount: -10,
      source: 'daily-expenses'
    });

    // Update stress based on energy levels
    const energy = this.resourceService.getResource('energy');
    if (energy < 30) {
      this.resourceService.updateResource({
        type: 'stress',
        amount: 10,
        source: 'low-energy'
      });
    }
  }

  start(): void {
    this.timeService.start();
  }

  pause(): void {
    this.timeService.pause();
  }

  setGameSpeed(speed: number): void {
    this.timeService.setSpeed(speed);
  }

  getCurrentState() {
    return {
      time: this.timeService.getState(),
      resources: this.resourceService.getAllResources()
    };
  }
}