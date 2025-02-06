import { useState, useCallback, useEffect } from 'react';
import { ResourceService } from '../application/services/ResourceService';
import { ResourceState, ResourceUpdate, ResourceType } from '../domain/resources/types';
import { useEventBus } from './useEventBus';

const resourceService = new ResourceService();

export function useResources() {
  const [resources, setResources] = useState<ResourceState>(resourceService.getAllResources());

  useEventBus('RESOURCE_CHANGED', useCallback((event) => {
    setResources(resourceService.getAllResources());
  }, []));

  const updateResource = useCallback((update: ResourceUpdate) => {
    resourceService.updateResource(update);
  }, []);

  const getResource = useCallback((type: ResourceType): number => {
    return resourceService.getResource(type);
  }, []);

  return {
    resources,
    updateResource,
    getResource
  };
}