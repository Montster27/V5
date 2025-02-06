import { useState, useCallback } from 'react';
import { StateService } from '../infrastructure/persistence/StateService';
import { useResources } from './useResources';
import { useTime } from './useTime';
import { useEventBus } from './useEventBus';

const stateService = new StateService();

export function useGameState() {
  const { resources } = useResources();
  const { timeState, pause } = useTime();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEventBus('STATE_CHANGED', useCallback((event) => {
    if (event.path[0] === 'save') {
      setIsSaving(false);
    } else if (event.path[0] === 'load') {
      setIsLoading(false);
    }
  }, []));

  const saveGame = useCallback(async () => {
    setIsSaving(true);
    pause();
    try {
      await stateService.saveState(resources, timeState);
    } catch (error) {
      console.error('Save failed:', error);
      setIsSaving(false);
    }
  }, [resources, timeState, pause]);

  const loadGame = useCallback(async () => {
    setIsLoading(true);
    pause();
    try {
      const state = await stateService.loadState();
      if (state) {
        // Add state restoration logic here
        return true;
      }
      return false;
    } catch (error) {
      console.error('Load failed:', error);
      setIsLoading(false);
      return false;
    }
  }, [pause]);

  const newGame = useCallback(async () => {
    pause();
    await stateService.clearState();
    // Add new game initialization logic here
  }, [pause]);

  return {
    saveGame,
    loadGame,
    newGame,
    isSaving,
    isLoading
  };
}