// /Users/montysharma/Documents/V5/mmv_clean/src/presentation/GameRoot.tsx

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../application/GameEngine';
import { useTime } from '../hooks/useTime';
import GameInterface from '../components/GameInterface';
import { GameError } from '../domain/shared/GameError';
import { ErrorDialog } from '../components/ErrorDialog';

interface GameErrorDisplay {
  error: GameError;
  timestamp: number;
}

export const GameRoot: React.FC = () => {
  const gameEngineRef = useRef<GameEngine>(new GameEngine());
  const timeState = useTime();
  const [errors, setErrors] = useState<GameErrorDisplay[]>([]);
  const [fatalError, setFatalError] = useState<GameError | null>(null);

  useEffect(() => {
    const gameEngine = gameEngineRef.current;
    
    // Register error handler
    gameEngine.registerErrorHandler((error: GameError) => {
      if (error.severity === 'fatal') {
        setFatalError(error);
        gameEngine.stop();
      } else {
        setErrors(prev => [...prev, { error, timestamp: Date.now() }]);
        // Auto-remove non-fatal errors after 5 seconds
        setTimeout(() => {
          setErrors(prev => prev.filter(e => e.timestamp !== Date.now()));
        }, 5000);
      }
    });

    // Initialize the game engine
    try {
      gameEngine.initialize(timeState);
      gameEngine.create();
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
    
    return () => {
      gameEngine.stop();
    };
  }, [timeState]);

  useEffect(() => {
    const gameEngine = gameEngineRef.current;
    
    if (!timeState.isPaused) {
      gameEngine.start();
    } else {
      gameEngine.stop();
    }
  }, [timeState.isPaused]);

  const handleRestartGame = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen relative">
      <GameInterface />

      {/* Non-fatal error notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {errors.map(({ error, timestamp }) => (
          <div
            key={timestamp}
            className={`p-4 rounded-lg shadow-lg animate-fade-in ${
              error.severity === 'warning' ? 'bg-yellow-800' : 'bg-red-800'
            } text-white`}
          >
            <div className="font-medium">{error.code}</div>
            <div className="text-sm">{error.message}</div>
          </div>
        ))}
      </div>

      {/* Fatal error dialog */}
      {fatalError && (
        <ErrorDialog 
          error={fatalError}
          onRestart={handleRestartGame}
        />
      )}
    </div>
  );
};