import { store } from '../store';
import { eventSlice } from '../store/slices/eventSlice';
import { 
  GameEvent, 
  EventTrigger, 
  EventTriggerState 
} from '../../domain/events/types';
import { GameError } from '../../domain/shared/GameError';

export class EventManager {
  private events: GameEvent[] = [];
  private errorHandlers: ((error: GameError) => void)[] = [];

  constructor() {
    this.loadEvents();
  }

  private async loadEvents() {
    try {
      // In a real implementation, this would load from a file or database
      // For now, we'll use a placeholder
      this.events = [];
    } catch (error) {
      this.handleError(new GameError(
        'Failed to load events',
        'EVENT_LOAD_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }

  public registerErrorHandler(handler: (error: GameError) => void): void {
    this.errorHandlers.push(handler);
  }

  private handleError(error: GameError): void {
    console.error(`[EventManager] ${error.code}:`, error.message, error.context);
    this.errorHandlers.forEach(handler => handler(error));
  }

  public checkForEvents(): void {
    try {
      const state = store.getState();

      // Create trigger state from current game state
      const triggerState: EventTriggerState = {
        resources: state.resources,
        skills: state.character.skills,
        status: Object.keys(state.character.activeEffects),
        gameHour: state.time.currentHour + (state.time.currentDay - 1) * 24,
        completedEvents: state.events.completedEvents
      };

      // Update available events
      store.dispatch(eventSlice.actions.updateAvailableEvents({
        events: this.events,
        triggerState
      }));

      // Clear expired events
      store.dispatch(eventSlice.actions.clearExpiredEvents(triggerState.gameHour));

      // If no active event, check for new events to trigger
      if (!state.events.activeEvent) {
        this.triggerEvents(triggerState);
      }
    } catch (error) {
      this.handleError(new GameError(
        'Error checking for events',
        'EVENT_CHECK_ERROR',
        'error',
        { originalError: error }
      ));
    }
  }

  private triggerEvents(triggerState: EventTriggerState): void {
    const state = store.getState();
    const availableEvents = state.events.availableEvents;

    // Find highest priority event that meets its trigger conditions
    for (const event of availableEvents) {
      if (this.checkTriggerConditions(event, triggerState)) {
        store.dispatch(eventSlice.actions.setActiveEvent(event));
        break;
      }
    }
  }

  private checkTriggerConditions(event: GameEvent, triggerState: EventTriggerState): boolean {
    switch (event.trigger) {
      case EventTrigger.TIME:
        // Time-based triggers use the event requirements
        return true;

      case EventTrigger.RESOURCE:
        // Check if any resources are at critical levels
        return Object.entries(triggerState.resources).some(([resource, value]) => {
          if (resource === 'energy' && value < 20) return true;
          if (resource === 'stress' && value > 80) return true;
          return false;
        });

      case EventTrigger.STATUS:
        // Check if character has relevant status effects
        return event.requirements?.some(req => 
          req.type === 'status' && triggerState.status.includes(req.target)
        ) ?? false;

      case EventTrigger.SKILL:
        // Check if any skills have reached trigger levels
        return event.requirements?.some(req =>
          req.type === 'skill' && 
          triggerState.skills[req.target] >= req.value
        ) ?? false;

      case EventTrigger.COMPLETION:
        // Check if required events are completed
        return event.requirements?.every(req =>
          req.type === 'completion' && 
          triggerState.completedEvents.includes(req.target)
        ) ?? false;

      default:
        return false;
    }
  }

  public completeEvent(eventId: string, choiceId: string): void {
    try {
      store.dispatch(eventSlice.actions.completeEvent({ eventId, choiceId }));
    } catch (error) {
      this.handleError(new GameError(
        'Error completing event',
        'EVENT_COMPLETE_ERROR',
        'error',
        { originalError: error, eventId, choiceId }
      ));
    }
  }
}