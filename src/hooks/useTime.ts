import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../application/store';
import { timeSlice } from '../application/store/slices/timeSlice';
import { TimeState } from '../domain/time/TimeState';

export function useTime(): TimeState {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.time);
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

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const resetDay = useCallback(() => {
    dispatch(timeSlice.actions.resetDay());
  }, [dispatch]);

  const getCurrentDate = useCallback(() => {
    // Convert game time to a Date object
    const startDate = new Date(1983, 8, 1); // September 1, 1983
    const gameDate = new Date(startDate);
    gameDate.setDate(startDate.getDate() + time.currentDay - 1);
    gameDate.setHours(time.currentHour);
    return gameDate;
  }, [time.currentDay, time.currentHour]);

  return {
    currentDate: getCurrentDate(),
    currentDay: time.currentDay,
    currentHour: time.currentHour,
    isPaused,
    speed,
    start,
    pause,
    setSpeed: updateSpeed,
    getCurrentDate,
    togglePause,
    resetDay,
    allocatedHours: time.allocatedHours
  };
}