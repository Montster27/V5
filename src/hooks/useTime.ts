// /Users/montysharma/Documents/V5/mmv_clean/src/hooks/useTime.ts

import { useState, useCallback } from 'react';
import { TimeState } from '../domain/time/TimeState';

export function useTime(): TimeState {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);

  const start = useCallback(() => {
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const getCurrentDate = useCallback(() => {
    return currentDate;
  }, [currentDate]);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    currentDate,
    isPaused,
    speed,
    start,
    pause,
    setSpeed: updateSpeed,
    getCurrentDate,
    togglePause
  };
}