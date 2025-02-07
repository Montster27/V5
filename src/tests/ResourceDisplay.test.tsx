/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import ResourceDisplay from '../components/ResourceDisplay';
import { mockResources } from './testUtils';

describe('ResourceDisplay', () => {
  it('renders all resources with correct values', () => {
    render(<ResourceDisplay resources={mockResources()} />);
    
    expect(screen.getByText('Money')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    
    expect(screen.getByText('Knowledge')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    expect(screen.getByText('Stress')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    const resources = {
      ...mockResources(),
      money: 1000000,
      knowledge: 1234,
    };
    
    render(<ResourceDisplay resources={resources} />);
    
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });
});
