import React from 'react';
import { Battery, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StressEnergyProps {
  className?: string;
}

export const StressEnergyDisplay: React.FC<StressEnergyProps> = ({ className = '' }) => {
  // These would normally come from your game state
  const energy = 75;
  const stress = 30;

  const getEnergyColor = (value: number) => {
    if (value > 66) return 'text-emerald-600';
    if (value > 33) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStressColor = (value: number) => {
    if (value < 33) return 'text-emerald-600';
    if (value < 66) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>      
      {/* Energy Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Battery className={`w-5 h-5 ${getEnergyColor(energy)}`} />
            <span className="font-medium text-slate-800">Energy</span>
          </div>
          <span className={`font-semibold ${getEnergyColor(energy)}`}>
            {energy}%
          </span>
        </div>
        <Progress value={energy} className="h-2 bg-slate-200" />
        <p className="text-sm text-slate-600">
          {energy > 66 ? 'Well rested' : 
           energy > 33 ? 'Getting tired' : 'Exhausted'}
        </p>
      </div>

      {/* Stress Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className={`w-5 h-5 ${getStressColor(stress)}`} />
            <span className="font-medium text-slate-800">Stress</span>
          </div>
          <span className={`font-semibold ${getStressColor(stress)}`}>
            {stress}%
          </span>
        </div>
        <Progress value={stress} className="h-2 bg-slate-200" />
        <p className="text-sm text-slate-600">
          {stress < 33 ? 'Relaxed' : 
           stress < 66 ? 'Moderate stress' : 'High stress'}
        </p>
      </div>

      {/* Effects */}
      <div className="p-3 bg-white rounded-lg border border-slate-200">
        <h3 className="text-sm font-medium text-slate-800 mb-2">Current Effects</h3>
        <ul className="text-sm space-y-1">
          {energy < 50 && (
            <li className="text-amber-600">
              • Reduced activity efficiency
            </li>
          )}
          {stress > 66 && (
            <li className="text-red-600">
              • High risk of burnout
            </li>
          )}
          {energy > 66 && stress < 33 && (
            <li className="text-emerald-600">
              • Peak performance
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};