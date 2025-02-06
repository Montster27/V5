import { useState, useCallback, useEffect } from 'react';
import { GameLoopService } from '../application/services/GameLoopService';
import { useEventBus } from './useEventBus';

const gameLoop = new GameLoopService();

export function useGameLoop() {
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [gameState, setGameState] = useState(gameLoop.getCurrentState());

  useEventBus('DAY_PASSED', useCallback(() => {
    setGameState(gameLoop.getCurrentState());
  }, []));

  const startGame = useCallback(() => {
    gameLoop.start();
    setIsPaused(false);
  }, []);

  const pauseGame = useCallback(() => {
    gameLoop.pause();
    setIsPaused(true);
  }, []);

  const setGameSpeed = useCallback((newSpeed: number) => {
    gameLoop.setGameSpeed(newSpeed);
    setSpeed(newSpeed);
  }, []);

  return {
    gameState,
    isPaused,
    speed,
    startGame,
    pauseGame,
    setGameSpeed
  };
}