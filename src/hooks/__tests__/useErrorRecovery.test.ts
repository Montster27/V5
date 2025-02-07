import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorRecovery } from '../useErrorRecovery';
import { ErrorReporting } from '../../utils/error-reporting';

jest.mock('../../utils/error-reporting', () => ({
  ErrorReporting: {
    getInstance: jest.fn(() => ({
      getErrorStats: jest.fn()
    }))
  }
}));

describe('useErrorRecovery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add error patterns', () => {
    const { result } = renderHook(() => useErrorRecovery());
    const mockPattern = {
      service: 'TestService',
      errorCount: 3,
      timeWindow: 5000,
      recoveryStrategy: jest.fn()
    };

    act(() => {
      result.current.addErrorPattern(mockPattern);
    });

    // Trigger error check interval
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Pattern should be registered and monitoring should be active
    expect(setInterval).toHaveBeenCalled();
  });

  it('should trigger recovery strategy when pattern matches', async () => {
    const mockRecoveryStrategy = jest.fn().mockResolvedValue(undefined);
    const mockPattern = {
      service: 'TestService',
      errorCount: 2,
      timeWindow: 5000,
      recoveryStrategy: mockRecoveryStrategy
    };

    // Mock error stats to trigger pattern
    (ErrorReporting.getInstance() as jest.Mocked<any>).getErrorStats.mockReturnValue({
      serviceCounts: {
        TestService: 2
      }
    });

    const { result } = renderHook(() => useErrorRecovery());

    act(() => {
      result.current.addErrorPattern(mockPattern);
    });

    // Trigger check
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockRecoveryStrategy).toHaveBeenCalled();
  });

  it('should not trigger recovery strategy outside time window', () => {
    const mockRecoveryStrategy = jest.fn().mockResolvedValue(undefined);
    const mockPattern = {
      service: 'TestService',
      errorCount: 2,
      timeWindow: 5000,
      recoveryStrategy: mockRecoveryStrategy
    };

    const { result } = renderHook(() => useErrorRecovery());

    act(() => {
      result.current.addErrorPattern(mockPattern);
    });

    // Advance past time window
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(mockRecoveryStrategy).not.toHaveBeenCalled();
  });

  it('should provide common recovery strategies', () => {
    const { result } = renderHook(() => useErrorRecovery());

    expect(result.current.commonRecoveryStrategies).toHaveProperty('retryActivity');
    expect(result.current.commonRecoveryStrategies).toHaveProperty('resetServiceState');
    expect(result.current.commonRecoveryStrategies).toHaveProperty('clearAndRetry');
  });

  it('should handle failed recovery attempts', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const mockRecoveryStrategy = jest.fn().mockRejectedValue(new Error('Recovery failed'));
    const mockPattern = {
      service: 'TestService',
      errorCount: 2,
      timeWindow: 5000,
      recoveryStrategy: mockRecoveryStrategy
    };

    (ErrorReporting.getInstance() as jest.Mocked<any>).getErrorStats.mockReturnValue({
      serviceCounts: {
        TestService: 2
      }
    });

    const { result } = renderHook(() => useErrorRecovery());

    act(() => {
      result.current.addErrorPattern(mockPattern);
    });

    // Trigger check
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Recovery strategy failed'),
      expect.any(Error)
    );
  });
});