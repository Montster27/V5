// /Users/montysharma/Documents/V5/mmv_clean/src/hooks/useResources.ts

import { useState, useCallback, useEffect } from 'react';
import { ResourceService } from '../application/services/ResourceService';
import { ResourceState, ResourceUpdate, ResourceType } from '../domain/resources/types';
import { useEventBus } from './useEventBus';
import { useStressEnergy } from './useStressEnergy';

const resourceService = new ResourceService();

export function useResources() {
  const [resources, setResources] = useState<ResourceState>(resourceService.getAllResources());
  const { modifiers } = useStressEnergy();

  useEventBus('RESOURCE_CHANGED', useCallback((event) => {
    setResources(resourceService.getAllResources());
  }, []));

  const updateResource = useCallback((update: ResourceUpdate) => {
    // Apply stress/energy modifiers to resource updates
    const modifiedUpdate: ResourceUpdate = {
      ...update,
      amount: update.amount * modifiers.energyModifier
    };
    resourceService.updateResource(modifiedUpdate);
  }, [modifiers.energyModifier]);

  const getResource = useCallback((type: ResourceType): number => {
    return resourceService.getResource(type);
  }, []);

  return {
    resources,
    updateResource,
    getResource,
    efficiencyModifier: modifiers.energyModifier
  };
}