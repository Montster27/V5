import { ResourceService } from '../../domain/services/ResourceService';
import { EventService } from '../../domain/services/EventService';
import { performanceMonitor } from '../../infrastructure/monitoring/PerformanceMonitor';
import { errorHandler } from '../../infrastructure/error/ErrorHandler';

describe('Resource Event Integration Tests', () => {
  let resourceService: ResourceService;
  let eventService: EventService;

  beforeEach(() => {
    resourceService = new ResourceService();
    eventService = new EventService();
  });

  it('should properly update resources when events occur', () => {
    // Initial state
    resourceService.setResource('money', 1000);
    resourceService.setResource('social', 50);
    
    // Trigger event with resource effects
    eventService.triggerEvent('party_attendance', {
      cost: 100,
      socialGain: 20
    });
    
    // Verify resource changes
    expect(resourceService.getResource('money')).toBe(900);
    expect(resourceService.getResource('social')).toBe(70);
  });

  it('should handle resource constraints properly', () => {
    // Set low initial money
    resourceService.setResource('money', 50);
    
    // Attempt expensive event
    const result = eventService.triggerEvent('expensive_dinner', {
      cost: 200,
      socialGain: 30
    });
    
    // Verify event was blocked
    expect(result.success).toBe(false);
    expect(resourceService.getResource('money')).toBe(50);
  });

  it('should maintain resource integrity during complex event chains', () => {
    performanceMonitor.startMeasurement('complex_event_chain');
    
    // Initial setup
    resourceService.setResource('money', 1000);
    resourceService.setResource('social', 50);
    resourceService.setResource('knowledge', 30);
    
    // Chain of events
    const events = [
      { type: 'study_group', cost: 0, knowledgeGain: 10, socialGain: 5 },
      { type: 'buy_books', cost: 200, knowledgeGain: 20 },
      { type: 'coffee_with_friends', cost: 50, socialGain: 15 },
      { type: 'weekend_trip', cost: 300, socialGain: 25, knowledgeGain: -5 }
    ];
    
    events.forEach(event => {
      eventService.triggerEvent(event.type, event);
    });
    
    performanceMonitor.endMeasurement('complex_event_chain');
    
    // Verify final state
    expect(resourceService.getResource('money')).toBe(450);
    expect(resourceService.getResource('social')).toBe(95);
    expect(resourceService.getResource('knowledge')).toBe(55);
  });

  it('should handle concurrent resource updates safely', async () => {
    resourceService.setResource('money', 1000);
    
    // Simulate concurrent events
    const promises = Array(10).fill(null).map(() => 
      Promise.resolve(eventService.triggerEvent('small_purchase', { cost: 100 }))
    );
    
    await Promise.all(promises);
    
    // Verify resources weren't corrupted
    expect(resourceService.getResource('money')).toBe(0);
  });

  it('should log performance metrics for resource updates', () => {
    performanceMonitor.startMeasurement('resource_updates');
    
    // Perform multiple resource updates
    for (let i = 0; i < 100; i++) {
      resourceService.updateResource('money', -1);
    }
    
    performanceMonitor.endMeasurement('resource_updates');
    const avgTime = performanceMonitor.getAverageMetric('resource_updates');
    
    expect(avgTime).toBeLessThan(50); // 50ms threshold
  });

  it('should handle error conditions gracefully', () => {
    const errorSpy = jest.spyOn(errorHandler, 'handleError');
    
    // Attempt invalid resource update
    resourceService.setResource('invalid_resource', 100);
    
    expect(errorSpy).toHaveBeenCalled();
    expect(resourceService.getResource('money')).toBeDefined();
  });
});