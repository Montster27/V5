import React from 'react';
import { useSelector } from 'react-redux';
import { Progress } from '@/components/ui/progress';

export const ResourceDisplay: React.FC = () => {
  const resources = useSelector((state: any) => state.resources);

  const formatValue = (name: string, value: number) => {
    if (name === 'money') return `$${value.toLocaleString()}`;
    return value.toString();
  };

  const getBarColor = (name: string, value: number) => {
    const classes = ['h-2'];
    if (name === 'energy' && value < 30) classes.push('low-energy');
    if (name === 'stress' && value > 70) classes.push('high-stress');
    return classes.join(' ');
  };

  const getTooltipText = (name: string) => {
    const tooltips: Record<string, string> = {
      money: 'Available funds',
      social: 'Social connections and influence',
      knowledge: 'Accumulated knowledge and skills',
      energy: 'Current energy level',
      stress: 'Current stress level'
    };
    return tooltips[name] || '';
  };

  const getMaxValue = (name: string) => {
    switch (name) {
      case 'energy':
      case 'social':
      case 'stress':
        return 100;
      case 'knowledge':
        return 1000;
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  };

  return (
    <div className="space-y-4 p-4">
      {Object.entries(resources).map(([name, value]) => {
        const isLowEnergy = name === 'energy' && value < 30;
        const containerClass = isLowEnergy ? 'relative low-energy' : 'relative';
        
        return (
          <div 
            key={name} 
            className={containerClass}
            data-testid={`${name}-bar`}
            title={getTooltipText(name)}
          >
            <div className="flex justify-between mb-1">
              <span className="capitalize">{name}</span>
              <span>{formatValue(name, value as number)}</span>
            </div>
            <Progress
              value={(value as number / getMaxValue(name)) * 100}
              className={getBarColor(name, value as number)}
            />
          </div>
        );
      })}
    </div>
  );
};