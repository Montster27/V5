import { EventBus } from '../EventBus';

export class ErrorHandler {
  constructor(private eventBus: EventBus) {
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.eventBus.subscribe('error:system', this.handleSystemError.bind(this));
    this.eventBus.subscribe('error:activity', this.handleActivityError.bind(this));
    this.eventBus.subscribe('error:state', this.handleStateError.bind(this));

    window.onerror = (message, source, line, column, error) => {
      this.eventBus.emit('error:system', { error, source, line, column });
    };

    window.onunhandledrejection = (event) => {
      this.eventBus.emit('error:system', { 
        error: event.reason,
        type: 'unhandled_promise'
      });
    };
  }

  private handleSystemError(error: any): void {
    console.error('[System Error]', error);
    this.eventBus.emit('ui:notification', {
      type: 'error',
      message: 'A system error occurred. Please try again.'
    });
  }

  private handleActivityError(error: any): void {
    console.error('[Activity Error]', error);
    this.eventBus.emit('ui:notification', {
      type: 'error',
      message: error.message || 'Failed to process activity'
    });
  }

  private handleStateError(error: any): void {
    console.error('[State Error]', error);
    this.eventBus.emit('ui:notification', {
      type: 'error',
      message: error.message || 'Game state error occurred'
    });
  }
}