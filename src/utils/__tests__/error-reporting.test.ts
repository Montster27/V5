import { ErrorReporting } from '../error-reporting';

describe('ErrorReporting', () => {
  let errorReporting: ErrorReporting;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };

  beforeAll(() => {
    // Mock console.error and console.warn
    console.error = jest.fn();
    console.warn = jest.fn();
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage
    });
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  beforeEach(() => {
    errorReporting = ErrorReporting.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should always return the same instance', () => {
      const instance1 = ErrorReporting.getInstance();
      const instance2 = ErrorReporting.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('reportError', () => {
    it('should queue an error with context', () => {
      const error = new Error('Test error');
      const context = { service: 'TestService' };

      errorReporting.reportError(error, context);
      expect(errorReporting.getQueueLength()).toBe(1);
    });

    it('should handle queue overflow', () => {
      // Fill queue to max
      for (let i = 0; i < 101; i++) {
        errorReporting.reportError(
          new Error(`Error ${i}`),
          { service: 'TestService', severity: 'low' }
        );
      }

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Error queue full'));
    });

    it('should prioritize higher severity errors', () => {
      // Fill queue with low severity errors
      for (let i = 0; i < 100; i++) {
        errorReporting.reportError(
          new Error(`Low severity error ${i}`),
          { service: 'TestService', severity: 'low' }
        );
      }

      // Add a critical error
      const criticalError = new Error('Critical error');
      errorReporting.reportError(
        criticalError,
        { service: 'SkillSystem', severity: 'critical' }
      );

      // Check that the error was added
      const stats = errorReporting.getErrorStats();
      expect(stats.severityCounts['critical']).toBe(1);
    });
  });

  describe('error processing', () => {
    it('should process errors by severity', async () => {
      // Add errors of different severities
      errorReporting.reportError(
        new Error('Low severity'),
        { service: 'TestService', severity: 'low' }
      );
      errorReporting.reportError(
        new Error('Critical severity'),
        { service: 'SkillSystem', severity: 'critical' }
      );

      await errorReporting.flushErrors();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL'),
        expect.any(Object)
      );
    });

    it('should group errors by service', async () => {
      // Add multiple errors for the same service
      errorReporting.reportError(
        new Error('Error 1'),
        { service: 'TestService' }
      );
      errorReporting.reportError(
        new Error('Error 2'),
        { service: 'TestService' }
      );

      await errorReporting.flushErrors();

      const stats = errorReporting.getErrorStats();
      expect(stats.serviceCounts['TestService']).toBe(0); // Should be 0 after flush
    });
  });

  describe('error statistics', () => {
    it('should track error counts correctly', () => {
      errorReporting.reportError(
        new Error('Test error 1'),
        { service: 'Service1', severity: 'low' }
      );
      errorReporting.reportError(
        new Error('Test error 2'),
        { service: 'Service2', severity: 'high' }
      );

      const stats = errorReporting.getErrorStats();
      expect(stats.queueLength).toBe(2);
      expect(stats.severityCounts['low']).toBe(1);
      expect(stats.severityCounts['high']).toBe(1);
      expect(stats.serviceCounts['Service1']).toBe(1);
      expect(stats.serviceCounts['Service2']).toBe(1);
    });
  });

  describe('session handling', () => {
    it('should create and reuse session ID', () => {
      // First call - should create new session ID
      mockSessionStorage.getItem.mockReturnValueOnce(null);
      errorReporting.reportError(new Error('Test error'), {});
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'errorReportingSessionId',
        expect.any(String)
      );

      // Second call - should reuse existing session ID
      mockSessionStorage.getItem.mockReturnValueOnce('existing_session');
      errorReporting.reportError(new Error('Test error 2'), {});
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('errorReportingSessionId');
    });
  });
});