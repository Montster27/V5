import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourceDisplay from '../../components/ResourceDisplay';
import { mockResources } from '../testUtils';

describe('ResourceDisplay Component', () => {
  it('renders all resources with correct values', () => {
    const resources = mockResources({
      money: 1000,
      knowledge: 50,
      socialPoints: 75,
      energy: 80,
      stress: 20
    });

    render(<ResourceDisplay resources={resources} />);
    
    expect(screen.getByText('Money')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    
    expect(screen.getByText('Knowledge')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    
    expect(screen.getByText('Stress')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('displays correct resource values', () => {
    const resources = mockResources({
      money: 1234567,
      knowledge: 987654,
      socialPoints: 12345,
      energy: 100,
      stress: 0
    });

    render(<ResourceDisplay resources={resources} />);
    
    expect(screen.getByText('$1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles resource constraints correctly', () => {
    const resources = mockResources({
      money: 1000,
      knowledge: 50,
      socialPoints: 75,
      energy: 20, // Low energy
      stress: 90  // High stress
    });

    render(<ResourceDisplay resources={resources} />);

    // Get the energy and stress cards
    const cards = screen.getAllByRole('article');
    
    // Energy card (index 3) should have warning class for low energy
    expect(cards[3]).toHaveClass('bg-red-50');
    
    // Stress card (index 4) should have warning class for high stress
    expect(cards[4]).toHaveClass('bg-red-50');
  });

  it('shows tooltips on hover', () => {
    const resources = mockResources();
    render(<ResourceDisplay resources={resources} />);

    const energyBar = screen.getByTestId('energy-bar');
    expect(energyBar).toHaveAttribute('title', 'Current Energy Level');
  });

  it('handles invalid resource values gracefully', () => {
    const resources = mockResources({
      money: NaN,
      knowledge: undefined as unknown as number,
      socialPoints: null as unknown as number,
      energy: NaN,
      stress: NaN
    });

    render(<ResourceDisplay resources={resources} />);
    
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});