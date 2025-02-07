import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceIntegrationErrorBoundary } from '../ServiceIntegrationErrorBoundary';

// Mock component that throws an error
const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal rendering</div>;
};

describe('ServiceIntegrationErrorBoundary', () => {
  const consoleError = console.error;
  beforeAll(() => {
    // Suppress console.error for cleaner test output
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ServiceIntegrationErrorBoundary serviceName="Test Service">
        <div>Test content</div>
      </ServiceIntegrationErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <ServiceIntegrationErrorBoundary serviceName="Test Service">
        <ErrorComponent />
      </ServiceIntegrationErrorBoundary>
    );

    expect(screen.getByText(/Service Error/)).toBeInTheDocument();
    expect(screen.getByText(/Test Service/)).toBeInTheDocument();
  });

  it('calls onError when error occurs', () => {
    const onError = jest.fn();
    render(
      <ServiceIntegrationErrorBoundary 
        serviceName="Test Service" 
        onError={onError}
      >
        <ErrorComponent />
      </ServiceIntegrationErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom fallback</div>;
    render(
      <ServiceIntegrationErrorBoundary 
        serviceName="Test Service" 
        fallback={fallback}
      >
        <ErrorComponent />
      </ServiceIntegrationErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('allows retry after error', () => {
    const { rerender } = render(
      <ServiceIntegrationErrorBoundary serviceName="Test Service">
        <ErrorComponent shouldThrow={true} />
      </ServiceIntegrationErrorBoundary>
    );

    // Verify error state
    expect(screen.getByText(/Service Error/)).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText('Retry'));

    // Rerender with non-throwing component
    rerender(
      <ServiceIntegrationErrorBoundary serviceName="Test Service">
        <ErrorComponent shouldThrow={false} />
      </ServiceIntegrationErrorBoundary>
    );

    expect(screen.getByText('Normal rendering')).toBeInTheDocument();
  });
});