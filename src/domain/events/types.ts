// src/domain/events/types.ts

export interface GameEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
  source?: string;
}

export type EventCallback = (event: GameEvent) => void;

export type EventUnsubscribe = () => void;

export interface EventSubscription {
  callback: EventCallback;
  createdAt: number;
}

export interface IEventBus {
  dispatch(event: GameEvent): void;
  subscribe(eventType: string, callback: EventCallback): EventUnsubscribe;
  clear(): void;
}