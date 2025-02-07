// /Users/montysharma/Documents/V5/mmv_clean/src/hooks/useStressEnergy.ts

import { useState, useEffect } from 'react';
import { StressEnergyState, StressEnergyModifiers } from '../domain/shared/StressEnergyTypes';
import { StressEnergyService } from '../domain/shared/StressEnergyService';
import { StressEnergyPersistenceService } from '../infrastructure/services/StressEnergyPersistenceService';
import { useGameLoop } from './useGameLoop';
import { useTime } from './useTime';

const INITIAL_STATE: StressEnergyState = {
  energy: 100,
  stress: 0,
  restHours: 8,
  activeHours: 0,
  studyHours: 0,
  workHours: 0,
  socialHours: 0
};

export const useStressEnergy = () => {
  const [state, setState] = useState<StressEnergyState>(() => {
    const savedState = StressEnergyPersistenceService.loadState();
    return savedState || INITIAL_STATE;
  });
  
  const [modifiers, setModifiers] = useState<StressEnergyModifiers>({
    energyModifier: 1,
    stressModifier: 1
  });

  const { delta } = useGameLoop();
  const { dayProgress } = useTime();

  // Update state based on game loop
  useEffect(() => {
    if (delta > 0) {
      const newState = StressEnergyService.updateState(state, delta);
      setState(newState);
      
      const newModifiers = StressEnergyService.calculateEfficiencyModifiers(newState);
      setModifiers(newModifiers);

      // Save state after each update
      StressEnergyPersistenceService.saveState(newState);
    }
  }, [delta, state]);

  // Reset daily counters at the end of each day
  useEffect(() => {
    if (dayProgress >= 1) {
      setState(prevState => {
        const newState = {
          ...prevState,
          activeHours: 0,
          studyHours: 0,
          workHours: 0,
          socialHours: 0,
          restHours: 0
        };
        StressEnergyPersistenceService.saveState(newState);
        return newState;
      });
    }
  }, [dayProgress]);

  // Calculate activity impact before performing it
  const calculateActivityImpact = (hours: number) => {
    return StressEnergyService.calculateActivityImpact(state, hours, delta);
  };

  // Record activity hours
  const recordActivity = (
    type: 'rest' | 'study' | 'work' | 'social',
    hours: number
  ) => {
    setState(prevState => {
      const newState = {
        ...prevState,
        [`${type}Hours`]: prevState[`${type}Hours`] + hours,
        activeHours: type !== 'rest' ? prevState.activeHours + hours : prevState.activeHours
      };
      StressEnergyPersistenceService.saveState(newState);
      return newState;
    });
  };

  // Reset state (for new game)
  const resetState = () => {
    setState(INITIAL_STATE);
    StressEnergyPersistenceService.clearState();
  };

  return {
    energy: state.energy,
    stress: state.stress,
    modifiers,
    calculateActivityImpact,
    recordActivity,
    resetState
  };
};