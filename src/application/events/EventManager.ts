import { EventService } from '../../domain/events/EventService';
import { GameEvent, EventChoice } from '../../domain/events/types';
import { ResourceManager } from '../resources/ResourceManager';
import { SkillManager } from '../skills/SkillManager';
import { GameStateManager } from '../game/GameStateManager';
import { EventBus } from '../EventBus';

export class EventManager {
  constructor(
    private eventService: EventService,
    private resourceManager: ResourceManager,
    private skillManager: SkillManager,
    private gameStateManager: GameStateManager,
    private eventBus: EventBus
  ) {}

  checkForEvents(): void {
    const events = this.eventService.checkForEvents(
      this.resourceManager.getState(),
      this.skillManager.getState(),
      this.gameStateManager.getState()
    );

    if (events.length > 0) {
      this.eventBus.emit('events:available', events);
    }
  }

  handleEventChoice(event: GameEvent, choice: EventChoice): void {
    try {
      this.eventService.processEventChoice(
        event,
        choice,
        this.resourceManager.getState(),
        this.skillManager.getState(),
        this.gameStateManager.getState()
      );
      
      this.eventBus.emit('events:choice:processed', {
        eventId: event.id,
        choiceId: choice.id
      });
    } catch (error) {
      this.eventBus.emit('events:choice:failed', {
        eventId: event.id,
        choiceId: choice.id,
        error: error.message
      });
    }
  }
}