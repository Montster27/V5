// src/infrastructure/events/EventBus.ts

import { debounce } from '@/utils/memoization';
import { ErrorHandler } from '../ErrorHandler';
import {
  GameEvent,
  EventCallback,
  EventUnsubscribe,
  EventSubscription,
  IEventBus
} from '@/domain/events/types';

export class EventBus implements IEventBus {
  private static instance: EventBus;
  private subscribers: Map<string, Map<number, EventSubscription>>;
  private subscriptionCounter: number;
  private readonly errorHandler: ErrorHandler;
  
  private static readonly CLEANUP_INTERVAL = 60000; // 1 minute
  private static readonly SUBSCRIPTION_TTL = 3600000; // 1 hour

  private constructor() {
    this.subscribers = new Map();
    this.subscriptionCounter = 0;
    this.errorHandler = ErrorHandler.getInstance();
    this.startCleanupInterval();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event type
   * Returns an unsubscribe function
   */
  public subscribe(eventType: string, callback: EventCallback): EventUnsubscribe {
    try {
      const subscriptionId = ++this.subscriptionCounter;
      const eventSubscribers = this.subscribers.get(eventType) || new Map();
      
      const subscription: EventSubscription = {
        callback,
        createdAt: Date.now()
      };

      eventSubscribers.set(subscriptionId, subscription);
      this.subscribers.set(eventType, eventSubscribers);

      // Return unsubscribe function
      return () => {
        try {
          const subscribers = this.subscribers.get(eventType);
          if (subscribers) {
            subscribers.delete(subscriptionId);
            if (subscribers.size === 0) {
              this.subscribers.delete(eventType);
            }
          }
        } catch (error) {
          this.errorHandler.handleError(error, 'EventBus.unsubscribe');
        }
      };
    } catch (error) {
      this.errorHandler.handleError(error, 'EventBus.subscribe');
      return () => {}; // Return no-op unsubscribe on error
    }
  }

  /**
   * Dispatch an event to all subscribers
   * Uses debounce decorator to prevent event flooding
   */
  @debounce(16) // Debounce to next frame
  public dispatch(event: GameEvent): void {
    try {
      const subscribers = this.subscribers.get(event.type);
      if (!subscribers) return;

      // Enhance event with timestamp if not present
      const enrichedEvent: GameEvent = {
        ...event,
        timestamp: event.timestamp || Date.now()
      };

      // Notify all subscribers
      subscribers.forEach(subscription => {
        try {
          subscription.callback(enrichedEvent);
        } catch (error) {
          this.errorHandler.handleError(error, {
            component: 'EventBus.dispatch',
            details: {
              eventType: event.type,
              subscriberCreatedAt: subscription.createdAt
            }
          });
        }
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'EventBus.dispatch');
    }
  }

  /**
   * Clear all subscriptions
   */
  public clear(): void {
    try {
      this.subscribers.clear();
      this.subscriptionCounter = 0;
    } catch (error) {
      this.errorHandler.handleError(error, 'EventBus.clear');
    }
  }

  /**
   * Start cleanup interval to remove stale subscriptions
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      try {
        this.cleanupStaleSubscriptions();
      } catch (error) {
        this.errorHandler.handleError(error, 'EventBus.cleanup');
      }
    }, EventBus.CLEANUP_INTERVAL);
  }

  /**
   * Remove stale subscriptions
   */
  private cleanupStaleSubscriptions(): void {
    const now = Date.now();
    
    this.subscribers.forEach((subscribers, eventType) => {
      subscribers.forEach((subscription, id) => {
        if (now - subscription.createdAt > EventBus.SUBSCRIPTION_TTL) {
          subscribers.delete(id);
        }
      });
      
      if (subscribers.size === 0) {
        this.subscribers.delete(eventType);
      }
    });
  }

  /**
   * Get diagnostic information about current subscriptions
   */
  public getDiagnostics(): Record<string, unknown> {
    const diagnostics: Record<string, unknown> = {
      totalEventTypes: this.subscribers.size,
      subscriptionCounter: this.subscriptionCounter,
      eventTypes: {}
    };

    this.subscribers.forEach((subscribers, eventType) => {
      (diagnostics.eventTypes as Record<string, unknown>)[eventType] = {
        subscriberCount: subscribers.size,
        oldestSubscription: Math.min(
          ...Array.from(subscribers.values()).map(s => s.createdAt)
        )
      };
    });

    return diagnostics;
  }
}