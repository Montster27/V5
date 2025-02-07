interface ErrorContext {
  service?: string;
  activity?: {
    id: string;
    name: string;
    type: string;
  };
  componentStack?: string;
  additionalData?: Record<string, unknown>;
}

export class ErrorReporting {
  private static instance: ErrorReporting;
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = [];
  private isProcessing = false;
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly PROCESS_INTERVAL = 5000; // 5 seconds
  private readonly ERROR_SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  } as const;

  private constructor() {
    this.startProcessingQueue();
  }

  public static getInstance(): ErrorReporting {
    if (!ErrorReporting.instance) {
      ErrorReporting.instance = new ErrorReporting();
    }
    return ErrorReporting.instance;
  }

  /**
   * Determine error severity based on context and error type
   */
  private determineErrorSeverity(error: Error, context: ErrorContext): typeof ErrorReporting.prototype.ERROR_SEVERITY_LEVELS[keyof typeof ErrorReporting.prototype.ERROR_SEVERITY_LEVELS] {
    // Critical: Unhandled errors in core services
    if (
      context.service &&
      ['SkillSystem', 'StressEnergy', 'GameLoop'].includes(context.service) &&
      error.name === 'UnhandledError'
    ) {
      return this.ERROR_SEVERITY_LEVELS.CRITICAL;
    }

    // High: Any error affecting game state
    if (error.name === 'StateError' || context.service === 'GameState') {
      return this.ERROR_SEVERITY_LEVELS.HIGH;
    }

    // Medium: Activity or UI errors
    if (context.activity || context.service === 'UI') {
      return this.ERROR_SEVERITY_LEVELS.MEDIUM;
    }

    // Low: All other errors
    return this.ERROR_SEVERITY_LEVELS.LOW;
  }

  /**
   * Report an error with context
   */
  public reportError(error: Error, context: ErrorContext): void {
    const severity = this.determineErrorSeverity(error, context);
    const enrichedContext = {
      ...context,
      severity,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    // Add error to queue
    if (this.errorQueue.length < this.MAX_QUEUE_SIZE) {
      this.errorQueue.push({ error, context: enrichedContext });
    } else {
      // If queue is full, drop lowest severity errors first
      const lowestSeverityError = this.findLowestSeverityError();
      if (lowestSeverityError !== -1) {
        this.errorQueue.splice(lowestSeverityError, 1);
        this.errorQueue.push({ error, context: enrichedContext });
      } else {
        console.warn('Error queue full, dropping new error');
      }
    }

    // Process immediately for critical errors
    if (severity === this.ERROR_SEVERITY_LEVELS.CRITICAL) {
      this.processQueue();
    }
  }

  /**
   * Find index of lowest severity error in queue
   */
  private findLowestSeverityError(): number {
    const severityOrder = Object.values(this.ERROR_SEVERITY_LEVELS);
    let lowestSeverityIndex = -1;
    let lowestSeverityLevel = severityOrder.length;

    this.errorQueue.forEach(({ context }, index) => {
      const severityLevel = severityOrder.indexOf(context.severity as string);
      if (severityLevel < lowestSeverityLevel) {
        lowestSeverityLevel = severityLevel;
        lowestSeverityIndex = index;
      }
    });

    return lowestSeverityIndex;
  }

  /**
   * Process the error queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) return;

    this.isProcessing = true;

    try {
      const errors = this.errorQueue.splice(0);
      
      // Group errors by severity and service
      const groupedErrors = errors.reduce((acc, { error, context }) => {
        const severity = context.severity || this.ERROR_SEVERITY_LEVELS.LOW;
        const service = context.service || 'unknown';
        
        if (!acc[severity]) {
          acc[severity] = {};
        }
        if (!acc[severity][service]) {
          acc[severity][service] = [];
        }
        
        acc[severity][service].push({ error, context });
        return acc;
      }, {} as Record<string, Record<string, Array<{ error: Error; context: ErrorContext }>>>);

      // Process errors by severity
      for (const severity of Object.values(this.ERROR_SEVERITY_LEVELS)) {
        if (groupedErrors[severity]) {
          await this.processErrorGroup(severity, groupedErrors[severity]);
        }
      }

    } catch (error) {
      console.error('Error processing error queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a group of errors with the same severity
   */
  private async processErrorGroup(
    severity: string,
    serviceErrors: Record<string, Array<{ error: Error; context: ErrorContext }>>
  ): Promise<void> {
    for (const [service, errors] of Object.entries(serviceErrors)) {
      console.error(`[${severity.toUpperCase()}] Errors in ${service}:`, {
        count: errors.length,
        errors: errors.map(({ error, context }) => ({
          message: error.message,
          stack: error.stack,
          context
        }))
      });

      // Here you would send to your error tracking service
      // await this.sendToErrorTrackingService(severity, service, errors);
    }
  }

  /**
   * Start processing queue at intervals
   */
  private startProcessingQueue(): void {
    setInterval(() => {
      this.processQueue();
    }, this.PROCESS_INTERVAL);
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (!window.sessionStorage.getItem('errorReportingSessionId')) {
      window.sessionStorage.setItem(
        'errorReportingSessionId',
        `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      );
    }
    return window.sessionStorage.getItem('errorReportingSessionId')!;
  }

  /**
   * Immediately process any pending errors
   */
  public async flushErrors(): Promise<void> {
    await this.processQueue();
  }

  /**
   * Check if there are pending errors
   */
  public hasPendingErrors(): boolean {
    return this.errorQueue.length > 0;
  }

  /**
   * Get current error queue length
   */
  public getQueueLength(): number {
    return this.errorQueue.length;
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    queueLength: number;
    severityCounts: Record<string, number>;
    serviceCounts: Record<string, number>;
  } {
    const stats = {
      queueLength: this.errorQueue.length,
      severityCounts: {} as Record<string, number>,
      serviceCounts: {} as Record<string, number>
    };

    this.errorQueue.forEach(({ context }) => {
      const severity = context.severity || this.ERROR_SEVERITY_LEVELS.LOW;
      const service = context.service || 'unknown';

      stats.severityCounts[severity] = (stats.severityCounts[severity] || 0) + 1;
      stats.serviceCounts[service] = (stats.serviceCounts[service] || 0) + 1;
    });

    return stats;
  }
}