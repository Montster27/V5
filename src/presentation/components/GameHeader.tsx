import React from 'react';
import { CharacterState } from '../../domain/game/types';

interface GameHeaderProps {
  characterState: CharacterState;
  day: number;
  hour: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ characterState, day, hour }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-gray-900">
            <h2 className="text-sm font-medium">Day {day}</h2>
            <p className="text-2xl font-bold">{hour}:00</p>
          </div>
          
          <div className="h-8 w-px bg-gray-200" />
          
          <div className="flex space-x-4">
            <StatusBar
              label="Energy"
              value={characterState.energy}
              color="blue"
            />
            <StatusBar
              label="Stress"
              value={characterState.stress}
              color="red"
            />
            <StatusBar
              label="Health"
              value={characterState.health}
              color="green"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => {/* TODO: Add menu handler */}}
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  </header>
);

interface StatusBarProps {
  label: string;
  value: number;
  color: 'red' | 'blue' | 'green';
}

const StatusBar: React.FC<StatusBarProps> = ({ label, value, color }) => {
  const colors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };

  return (
    <div className="w-32">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};