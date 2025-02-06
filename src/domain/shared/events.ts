export interface EventBus {
  emit<T>(eventType: string, payload: T): void;
  subscribe<T>(eventType: string, handler: (payload: T) => void): void;
  unsubscribe<T>(eventType: string, handler: (payload: T) => void): void;
}

export interface GameEvent {
  type: string;
  timestamp: number;
  payload: unknown;
}