import { ErrorLevel, ErrorType, GameError } from '../../domain/types/errors';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: GameError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, type: ErrorType = ErrorType.GENERAL, level: ErrorLevel = ErrorLevel.ERROR): void {
    const gameError: GameError = {
      timestamp: new Date(),
      message: error.message,
      type,
      level,
      stack: error.stack
    };

    this.logError(gameError);
    this.notifyError(gameError);
    
    if (level === ErrorLevel.FATAL) {
      this.handleFatalError(gameError);
    }
  }

  private logError(error: GameError): void {
    this.errorLog.push(error);
    if (error.message.includes("invalid_skill") || error.message.includes("invalid_type")) {
      console.warn(`[${error.level}] ${error.type}: ${error.message}`);
    } else {
      console.error(`[${error.level}] ${error.type}: ${error.message}`);
    }
  }

  private notifyError(error: GameError): void {
    // TODO: Implement error notification system (e.g., toast messages)
  }

  private handleFatalError(error: GameError): void {
    // TODO: Implement fatal error handling (e.g., game state save, reload)
  }

  getErrorLog(): GameError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();
