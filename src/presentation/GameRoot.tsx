import React, { useEffect, useState } from 'react';
import { GameEngine } from '../application/GameEngine';
import { GameTime } from '../domain/time/types';
import { Resource } from '../domain/resources/types';

export const GameRoot: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameTime, setGameTime] = useState<GameTime>({ day: 1, hour: 8, minute: 0 });
  const [resources, setResources] = useState<Resource[]>([]);
  const [engine, setEngine] = useState<GameEngine | null>(null);

  useEffect(() => {
    try {
      const gameEngine = GameEngine.create();
      gameEngine.onTimeUpdate = (time: GameTime) => {
        setGameTime(time);
      };
      gameEngine.onResourceUpdate = (resources: Resource[]) => {
        setResources(resources);
      };
      setEngine(gameEngine);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize game engine');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!engine) return;
    
    try {
      engine.start();
      return () => engine.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game engine');
    }
  }, [engine]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-4">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-4">MMV Game</h1>
      
      <div className="bg-gray-800 p-2 rounded mb-4">
        Day {gameTime.day}, {gameTime.hour}:{gameTime.minute.toString().padStart(2, '0')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {resources.map(resource => (
          <div key={resource.type} className="bg-gray-800 p-2 rounded">
            <div className="font-bold">{resource.type}</div>
            <div className="flex justify-between">
              <span>{resource.value.toFixed(0)}</span>
              <span className="text-gray-400">/ {resource.maxValue}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div 
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${(resource.value / resource.maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};