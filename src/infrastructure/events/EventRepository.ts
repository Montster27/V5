import { GameEvent } from '../../domain/events/types';

export class EventRepository {
  private events: Map<string, GameEvent>;

  constructor() {
    this.events = new Map();
  }

  async loadEvents(): Promise<GameEvent[]> {
    // TODO: Load from persistence
    return Array.from(this.events.values());
  }

  async saveEventState(eventId: string, state: any): Promise<void> {
    // TODO: Persist event state
  }

  async getEvent(eventId: string): Promise<GameEvent | undefined> {
    return this.events.get(eventId);
  }
}