import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivityErrorBoundary } from '../ActivityErrorBoundary';
import { Activity } from '../../../services/activities/types';

// Mock component that throws an error
const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test activity error');
  }
  return <div>Activity content</div>;
};

describe('ActivityErrorBoundary', () => {
  const mockActivity: Activity = {
    id: 'test-activity',
    name: 'Test Activity',
    description: 'Test activity description',
    duration: 1,
    type: 'study'
  };

  const consoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ActivityErrorBoundary>
        <div>Normal activity content</div>
      </ActivityErrorBoundary>
    );

    expect(screen.getByText('Normal activity content')).toBeInTheDocument();
  });

  it('renders error UI with activity details when error occurs', () => {
    render(
      <ActivityErrorBoundary activity={mockActivity}>
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(screen.getByText(/Activity System Issue/)).toBeInTheDocument();
    expect(screen.getByText(/Test Activity/)).toBeInTheDocument();
  });

  it('calls onActivityFallback when provided', () => {
    const onActivityFallback = jest.fn();
    render(
      <ActivityErrorBoundary 
        activity={mockActivity}
        onActivityFallback={onActivityFallback}
      >
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(onActivityFallback).toHaveBeenCalledWith(mockActivity);
  });

  it('calls both onError and onActivityFallback when provided', () => {
    const onError = jest.fn();
    const onActivityFallback = jest.fn();
    
    render(
      <ActivityErrorBoundary 
        activity={mockActivity}
        onError={onError}
        onActivityFallback={onActivityFallback}
      >
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onActivityFallback).toHaveBeenCalledWith(mockActivity);
  });

  it('shows alternative options in error UI', () => {
    render(
      <ActivityErrorBoundary activity={mockActivity}>
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(screen.getByText(/Alternative options:/)).toBeInTheDocument();
    expect(screen.getByText(/Try a different activity/)).toBeInTheDocument();
  });

  it('displays affected features list', () => {
    render(
      <ActivityErrorBoundary activity={mockActivity}>
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(screen.getByText(/The following features may be affected:/)).toBeInTheDocument();
    expect(screen.getByText(/Activity completion and rewards/)).toBeInTheDocument();
    expect(screen.getByText(/Skill XP gains/)).toBeInTheDocument();
  });

  it('works without activity prop', () => {
    render(
      <ActivityErrorBoundary>
        <ErrorComponent />
      </ActivityErrorBoundary>
    );

    expect(screen.getByText(/Activity System Issue/)).toBeInTheDocument();
    expect(screen.queryByText(/Activity:/)).not.toBeInTheDocument();
  });
});