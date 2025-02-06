import React, { useState, useCallback } from 'react';
import { Play, Pause, Save, RotateCcw, FastForward } from 'lucide-react';

// Mock data for development
const mockGameState = {
  time: {
    currentDate: {
      timestamp: Date.now(),
      day: 1,
      month: 0,
      year: 1983
    },
    speed: 1,
    isPaused: true
  },
  resources: {
    energy: 100,
    stress: 0,
    money: 1000,
    knowledge: 0,
    social: 0
  }
};

export default function GameInterface() {
  const [gameState, setGameState] = useState(mockGameState);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const toggleSpeed = useCallback(() => {
    setSpeed(speed === 1 ? 2 : 1);
  }, [speed]);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    // Save implementation will go here
    setTimeout(() => setIsSaving(false), 1000);
  }, []);

  const handleNewGame = useCallback(() => {
    setGameState(mockGameState);
    setIsPaused(true);
    setSpeed(1);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-xl font-bold">
          {formatDate(new Date(gameState.time.currentDate.timestamp))}
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 rounded hover:bg-gray-100"
            onClick={togglePause}
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          <button 
            className="p-2 rounded hover:bg-gray-100"
            onClick={toggleSpeed}
          >
            <FastForward size={24} className={speed > 1 ? "text-blue-500" : ""} />
          </button>
          <button 
            className="p-2 rounded hover:bg-gray-100"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={24} />
          </button>
          <button 
            className="p-2 rounded hover:bg-gray-100"
            onClick={handleNewGame}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Resource Display */}
      <div className="grid grid-cols-5 gap-4 p-4">
        {Object.entries(gameState.resources).map(([resource, value]) => (
          <div 
            key={resource}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="text-sm text-gray-500 capitalize">{resource}</div>
            <div className="text-2xl font-bold">{Math.round(value)}</div>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Activities Panel */}
          <h2 className="text-lg font-bold mb-4">Activities</h2>
          <div className="space-y-2">
            <button 
              className="w-full p-2 text-left rounded hover:bg-gray-100"
              onClick={() => {
                const newState = { ...gameState };
                newState.resources.knowledge += 5;
                newState.resources.energy -= 10;
                setGameState(newState);
              }}
            >
              Study (+5 Knowledge, -10 Energy)
            </button>
            <button 
              className="w-full p-2 text-left rounded hover:bg-gray-100"
              onClick={() => {
                const newState = { ...gameState };
                newState.resources.money += 10;
                newState.resources.energy -= 15;
                setGameState(newState);
              }}
            >
              Work (+10 Money, -15 Energy)
            </button>
            <button 
              className="w-full p-2 text-left rounded hover:bg-gray-100"
              onClick={() => {
                const newState = { ...gameState };
                newState.resources.social += 3;
                newState.resources.energy -= 5;
                setGameState(newState);
              }}
            >
              Socialize (+3 Social, -5 Energy)
            </button>
            <button 
              className="w-full p-2 text-left rounded hover:bg-gray-100"
              onClick={() => {
                const newState = { ...gameState };
                newState.resources.energy = Math.min(100, newState.resources.energy + 20);
                setGameState(newState);
              }}
            >
              Rest (+20 Energy)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 col-span-2">
          {/* Events Panel */}
          <h2 className="text-lg font-bold mb-4">Events</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-bold">Daily Update</div>
              <div className="text-sm text-gray-600">
                Your energy decreased by 5 points due to daily activities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}