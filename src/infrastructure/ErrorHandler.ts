// src/infrastructure/ErrorHandler.ts

interface ErrorContext {
  component?: string;
  errorCode?: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

interface ErrorReport {
  error: Error;
  context: ErrorContext;
}

class LoggingService {
  public async logError(error: Error, context: ErrorContext): Promise<void> {
    console.error('[Game Error]', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  public async logWarning(message: string, context: ErrorContext): Promise<void> {
    console.warn('[Game Warning]', {
      message,
      ...context
    });
  }
}

class AnalyticsService {
  public async trackError(report: ErrorReport): Promise<void> {
    // In a real implementation, this would send to an analytics service
    console.info('[Analytics]', 'Error tracked:', report);
  }

  public async trackWarning(message: string, context: ErrorContext): Promise<void> {
    // In a real implementation, this would send to an analytics service
    console.info('[Analytics]', 'Warning tracked:', { message, context });
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCache: Map<string, ErrorReport[]>;
  
  private constructor(
    private logger: LoggingService,
    private analytics: AnalyticsService
  ) {
    this.errorCache = new Map();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(
        new LoggingService(),
        new AnalyticsService()
      );
    }
    return ErrorHandler.instance;
  }

  public async handleError(error: Error, contextInfo?: string | ErrorContext): Promise<void> {
    const context: ErrorContext = this.normalizeContext(contextInfo);
    const report: ErrorReport = { error, context };

    // Cache the error for pattern detection
    this.cacheError(report);

    // Log and track the error
    await Promise.all([
      this.logger.logError(error, context),
      this.analytics.trackError(report)
    ]);

    // Check for error patterns
    this.detectErrorPatterns();
  }

  public async handleWarning(message: string, contextInfo?: string | ErrorContext): Promise<void> {
    const context: ErrorContext = this.normalizeContext(contextInfo);

    await Promise.all([
      this.logger.logWarning(message, context),
      this.analytics.trackWarning(message, context)
    ]);
  }

  private normalizeContext(contextInfo?: string | ErrorContext): ErrorContext {
    if (typeof contextInfo === 'string') {
      return {
        component: contextInfo,
        timestamp: Date.now()
      };
    }

    return {
      ...contextInfo,
      timestamp: Date.now()
    };
  }

  private cacheError(report: ErrorReport): void {
    const key = this.getErrorKey(report.error);
    const cached = this.errorCache.get(key) || [];
    cached.push(report);
    
    // Keep only last 10 errors of each type
    if (cached.length > 10) {
      cached.shift();
    }
    
    this.errorCache.set(key, cached);
  }

  private getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  private detectErrorPatterns(): void {
    for (const [key, errors] of this.errorCache.entries()) {
      // Check for frequent errors (more than 3 in last minute)
      const recentErrors = errors.filter(
        e => Date.now() - e.context.timestamp < 60000
      );

      if (recentErrors.length > 3) {
        this.handleWarning(
          `Frequent error pattern detected: ${key}`,
          {
            component: 'ErrorHandler',
            details: { frequency: recentErrors.length }
          }
        );
      }
    }
  }

  public clearErrorCache(): void {
    this.errorCache.clear();
  }
}