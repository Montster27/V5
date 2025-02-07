/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import EventDisplay from '../components/EventDisplay';
import { mockEvent } from './testUtils';

describe('EventDisplay', () => {
  const mockOnChooseOption = jest.fn();
  const testEvent = mockEvent();

  beforeEach(() => {
    mockOnChooseOption.mockClear();
  });

  it('renders event title and description', () => {
    render(<EventDisplay event={testEvent} onChooseOption={mockOnChooseOption} />);
    
    expect(screen.getByText(testEvent.title)).toBeInTheDocument();
    expect(screen.getByText(testEvent.description)).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<EventDisplay event={testEvent} onChooseOption={mockOnChooseOption} />);
    
    testEvent.options.forEach(option => {
      expect(screen.getByText(option.text)).toBeInTheDocument();
    });
  });

  it('calls onChooseOption with correct option ID when clicked', () => {
    render(<EventDisplay event={testEvent} onChooseOption={mockOnChooseOption} />);
    
    const option1 = screen.getByText(testEvent.options[0].text);
    fireEvent.click(option1);
    expect(mockOnChooseOption).toHaveBeenCalledWith(testEvent.options[0].id);
    
    const option2 = screen.getByText(testEvent.options[1].text);
    fireEvent.click(option2);
    expect(mockOnChooseOption).toHaveBeenCalledWith(testEvent.options[1].id);
  });
});