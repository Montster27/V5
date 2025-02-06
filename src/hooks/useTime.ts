import { useState, useCallback, useEffect } from 'react';
import { TimeService } from '../application/services/TimeService';
import { TimeState } from '../domain/time/types';
import { useEventBus } from './useEventBus';

const timeService = new TimeService();

export function useTime() {
  const [timeState, setTimeState] = useState<TimeState>(timeService.getState());

  useEventBus('DAY_PASSED', useCallback(() => {
    setTimeState(timeService.getState());
  }, []));

  const start = useCallback(() => {
    timeService.start();
    setTimeState(timeService.getState());
  }, []);

  const pause = useCallback(() => {
    timeService.pause();
    setTimeState(timeService.getState());
  }, []);

  const setSpeed = useCallback((speed: number) => {
    timeService.setSpeed(speed);
    setTimeState(timeService.getState());
  }, []);

  const getCurrentDate = useCallback(() => {
    return timeService.getCurrentDate();
  }, []);

  return {
    timeState,
    start,
    pause,
    setSpeed,
    getCurrentDate
  };
}