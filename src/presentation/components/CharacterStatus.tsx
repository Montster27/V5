import React from 'react';
import { CharacterState } from '../../domain/game/types';
import { StatusEffect } from '../../domain/character/CharacterStatusService';

interface CharacterStatusProps {
  status: CharacterState;
  effects: StatusEffect[];
}

export const CharacterStatus: React.FC<CharacterStatusProps> = ({ status, effects }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Character Status</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Energy</label>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded"
              style={{ width: `${status.energy}%` }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Stress</label>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-red-500 rounded"
              style={{ width: `${status.stress}%` }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Belonging</label>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-green-500 rounded"
              style={{ width: `${status.belonging}%` }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Health</label>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-yellow-500 rounded"
              style={{ width: `${status.health}%` }}
            />
          </div>
        </div>
      </div>

      {effects.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Active Effects</h3>
          <div className="space-y-2">
            {effects.map((effect, index) => (
              <div 
                key={index}
                className={`p-2 rounded text-sm ${
                  effect.type === 'buff' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {effect.source}: {effect.type === 'buff' ? '+' : '-'}
                {effect.value} {effect.attribute}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};