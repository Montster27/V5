import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EventDisplay from '../../components/EventDisplay';

describe('EventDisplay Component', () => {
  const mockEvent = {
    id: 'test-event',
    title: 'Test Event',
    description: 'This is a test event',
    timeLimit: 30,
    options: [
      { 
        id: 'choice1', 
        text: 'Accept',
        consequences: {
          resources: {
            money: -100,
            social: 10
          }
        }
      },
      { 
        id: 'choice2', 
        text: 'Decline',
        consequences: {
          resources: {
            social: -5
          }
        }
      }
    ]
  };

  const mockOnChooseOption = jest.fn();
  const mockOnTimeExpired = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnChooseOption.mockClear();
    mockOnTimeExpired.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders event information correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Decline')).toBeInTheDocument();
  });

  it('handles choice selection correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    const acceptButton = screen.getByTestId('choice-choice1');
    fireEvent.click(acceptButton);

    expect(mockOnChooseOption).toHaveBeenCalledWith('choice1');

    // Verify button is disabled after selection
    expect(acceptButton).toBeDisabled();

    // Verify other buttons are also disabled
    const declineButton = screen.getByTestId('choice-choice2');
    expect(declineButton).toBeDisabled();
  });

  it('updates timer correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    const timerElement = screen.getByTestId('event-timer');
    expect(timerElement).toHaveTextContent('30s');

    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(timerElement).toHaveTextContent('29s');

    // Advance time by another second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(timerElement).toHaveTextContent('28s');
  });

  it('handles time expiration correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    // Advance time by full duration
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(mockOnTimeExpired).toHaveBeenCalled();
    expect(screen.getByTestId('event-timer')).toHaveTextContent('0s');
  });

  it('displays choice effects correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    // Check money effect
    const moneyEffect = screen.getByTestId('effect-money');
    expect(moneyEffect).toHaveTextContent('-$100');

    // Check social effect
    const socialEffect = screen.getByTestId('effect-social');
    expect(socialEffect).toHaveTextContent('+10 social');
  });

  it('handles multiple rapid choice selections correctly', () => {
    render(
      <EventDisplay 
        event={mockEvent} 
        onChooseOption={mockOnChooseOption}
        onTimeExpired={mockOnTimeExpired}
      />
    );

    const acceptButton = screen.getByTestId('choice-choice1');
    
    // Simulate multiple rapid clicks
    for (let i = 0; i < 5; i++) {
      fireEvent.click(acceptButton);
    }

    // Should only call the handler once
    expect(mockOnChooseOption).toHaveBeenCalledTimes(1);
    expect(mockOnChooseOption).toHaveBeenCalledWith('choice1');
  });

  it('handles events without time limits', () => {
    const eventWithoutTimer = {
      ...mockEvent,
      timeLimit: undefined
    };

    render(
      <EventDisplay 
        event={eventWithoutTimer} 
        onChooseOption={mockOnChooseOption}
      />
    );

    // Timer should not be present
    expect(screen.queryByTestId('event-timer')).not.toBeInTheDocument();

    // Choices should still work
    const acceptButton = screen.getByTestId('choice-choice1');
    fireEvent.click(acceptButton);
    expect(mockOnChooseOption).toHaveBeenCalledWith('choice1');
  });

  it('formats different effect types correctly', () => {
    const eventWithVariousEffects = {
      ...mockEvent,
      options: [{
        id: 'choice1',
        text: 'Test',
        consequences: {
          resources: {
            money: -100,
            social: 10,
            energy: -20,
            stress: 5
          }
        }
      }]
    };

    render(
      <EventDisplay 
        event={eventWithVariousEffects} 
        onChooseOption={mockOnChooseOption}
      />
    );

    expect(screen.getByTestId('effect-money')).toHaveTextContent('-$100');
    expect(screen.getByTestId('effect-social')).toHaveTextContent('+10 social');
    expect(screen.getByTestId('effect-energy')).toHaveTextContent('-20 energy');
    expect(screen.getByTestId('effect-stress')).toHaveTextContent('+5 stress');
  });
});