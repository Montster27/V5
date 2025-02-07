type EventHandler<T = any> = (event: T) => void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  emit<T>(eventType: string, event: T): void {
    this.publish(eventType, event);
  }

  publish<T>(eventType: string, event: T): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

// Event types
export interface TimeEvent {
  type: 'DAY_PASSED' | 'WEEK_PASSED' | 'MONTH_PASSED';
  currentDate: Date;
}

export interface ResourceEvent {
  type: 'RESOURCE_CHANGED';
  resource: 'energy' | 'stress' | 'money' | 'knowledge' | 'social';
  value: number;
  delta: number;
}

export interface StateEvent {
  type: 'STATE_CHANGED';
  path: string[];
  value: any;
  previousValue: any;
}

// Create singleton instance
export const eventBus = new EventBus();