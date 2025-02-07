import { renderHook } from '@testing-library/react-hooks';
import { useErrorHandling } from '../useErrorHandling';
import { ErrorReporting } from '../../utils/error-reporting';

jest.mock('../../utils/error-reporting', () => ({
  ErrorReporting: {
    getInstance: jest.fn(() => ({
      reportError: jest.fn()
    }))
  }
}));

describe('useErrorHandling', () => {
  const mockError = new Error('Test error');
  const mockErrorInfo = { componentStack: 'Test stack' };
  const mockActivity = {
    id: 'test-activity',
    name: 'Test Activity',
    type: 'study',
    description: 'Test description',
    duration: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should report errors with service context', () => {
    const { result } = renderHook(() => 
      useErrorHandling({ service: 'TestService' })
    );

    result.current.handleError(mockError, mockErrorInfo);

    expect(ErrorReporting.getInstance().reportError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        service: 'TestService',
        componentStack: mockErrorInfo.componentStack
      })
    );
  });

  it('should report errors with activity context', () => {
    const { result } = renderHook(() => 
      useErrorHandling({ 
        service: 'ActivityService',
        activity: mockActivity
      })
    );

    result.current.handleError(mockError, mockErrorInfo);

    expect(ErrorReporting.getInstance().reportError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        service: 'ActivityService',
        activity: {
          id: mockActivity.id,
          name: mockActivity.name,
          type: mockActivity.type
        }
      })
    );
  });

  it('should handle activity fallback', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    const { result } = renderHook(() => useErrorHandling());

    result.current.handleActivityFallback(mockActivity);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(mockActivity.name)
    );
  });

  it('should include additional data in error report', () => {
    const additionalData = { customField: 'test' };
    const { result } = renderHook(() => 
      useErrorHandling({ 
        service: 'TestService',
        additionalData
      })
    );

    result.current.handleError(mockError, mockErrorInfo);

    expect(ErrorReporting.getInstance().reportError).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        additionalData
      })
    );
  });
});