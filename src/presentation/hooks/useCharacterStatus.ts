import { useState, useEffect } from 'react';
import { CharacterState } from '../../domain/game/types';
import { StatusEffect } from '../../domain/character/CharacterStatusService';
import { CharacterStatusManager } from '../../application/character/CharacterStatusManager';
import { useEventBus } from './useEventBus';

export const useCharacterStatus = (statusManager: CharacterStatusManager) => {
  const [status, setStatus] = useState<CharacterState>(statusManager.getStatus());
  const [effects, setEffects] = useState<StatusEffect[]>(statusManager.getActiveEffects());
  const eventBus = useEventBus();

  useEffect(() => {
    const handleStatusUpdate = ({ status, effects }: {
      status: CharacterState;
      effects: StatusEffect[];
    }) => {
      setStatus(status);
      setEffects(effects);
    };

    eventBus.subscribe('character:status:updated', handleStatusUpdate);

    return () => {
      eventBus.unsubscribe('character:status:updated', handleStatusUpdate);
    };
  }, [eventBus]);

  return {
    status,
    effects
  };
};