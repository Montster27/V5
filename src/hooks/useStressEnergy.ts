// src/hooks/useStressEnergy.ts

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStressEnergyState,
  selectEfficiencyModifiers,
  selectStateWarnings,
  selectIsLoading,
  selectError,
  updateStressEnergyState,
  addActivityHours,
  resetDailyHours
} from '@/store/slices/stressEnergySlice';
import type { StressEnergyState } from '@/domain/services/StressEnergyService';

export function useStressEnergy() {
  const dispatch = useDispatch();
  const state = useSelector(selectStressEnergyState);
  const efficiencyModifiers = useSelector(selectEfficiencyModifiers);
  const warnings = useSelector(selectStateWarnings);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const update = useCallback((delta: number) => {
    dispatch(updateStressEnergyState(delta));
  }, [dispatch]);

  const addActivity = useCallback((activity: 'study' | 'work' | 'social' | 'rest', hours: number) => {
    dispatch(addActivityHours({ activity, hours }));
  }, [dispatch]);

  const resetDaily = useCallback(() => {
    dispatch(resetDailyHours());
  }, [dispatch]);

  const getEfficiencyPercentage = useCallback(() => {
    const { energyModifier } = efficiencyModifiers;
    return Math.round(energyModifier * 100);
  }, [efficiencyModifiers]);

  return {
    state,
    efficiencyModifiers,
    warnings,
    isLoading,
    error,
    update,
    addActivity,
    resetDaily,
    getEfficiencyPercentage,
  };
}

// Type exports for components
export type { StressEnergyState };