import { useState, useCallback, useEffect } from 'react';
import { SaveManager } from '../infrastructure/persistence/SaveManager';
import { SaveMetadata } from '../infrastructure/persistence/types';
import { GameError } from '../domain/shared/GameError';

export const useSaveLoad = (onError: (error: GameError) => void) => {
  const [saveManager] = useState(() => new SaveManager());
  const [saves, setSaves] = useState<SaveMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    saveManager.registerErrorHandler(onError);
    loadSaveList();

    // Set up autosave interval
    const autosaveInterval = setInterval(() => {
      saveManager.autoSave().catch(console.error);
    }, 5 * 60 * 1000); // Autosave every 5 minutes

    return () => clearInterval(autosaveInterval);
  }, [onError]);

  const loadSaveList = useCallback(async () => {
    const saveList = await saveManager.listSaves();
    setSaves(saveList);
  }, []);

  const saveGame = useCallback(async (name: string) => {
    setIsSaving(true);
    try {
      const metadata = await saveManager.saveGame(name);
      setSaves(prev => [metadata, ...prev]);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadGame = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await saveManager.loadGame(id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSave = useCallback(async (id: string) => {
    await saveManager.deleteSave(id);
    setSaves(prev => prev.filter(save => save.id !== id));
  }, []);

  const quickSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const metadata = await saveManager.saveGame('Quick Save');
      setSaves(prev => [metadata, ...prev]);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saves,
    isLoading,
    isSaving,
    saveGame,
    loadGame,
    deleteSave,
    quickSave,
    refreshSaves: loadSaveList
  };
};