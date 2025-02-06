import { EventBus } from '../application/EventBus';
import { GameStateManager } from '../application/game/GameStateManager';
import { ActivityManager } from '../application/activities/ActivityManager';
import { createMockGameState } from './testUtils';

describe('Performance Tests', () => {
  // Setup measurement utils
  const measureExecutionTime = async (fn: () => Promise<void> | void): Promise<number> => {
    const start = performance.now();
    await fn();
    return performance.now() - start;
  };

  test('game loop performance under load', async () => {
    const eventBus = new EventBus();
    const gameState = createMockGameState();
    const cycleCount = 1000;
    
    const times = await measureExecutionTime(async () => {
      for (let i = 0; i < cycleCount; i++) {
        eventBus.emit('time:tick', 1);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    });

    expect(times / cycleCount).toBeLessThan(16); // Target 60fps
  });

  test('event processing scales linearly', async () => {
    const eventBus = new EventBus();
    const baseCount = 100;
    const scaledCount = 1000;
    
    const baseTime = await measureExecutionTime(() => {
      for (let i = 0; i < baseCount; i++) {
        eventBus.emit('effect:applied', { type: 'buff', value: 1 });
      }
    });

    const scaledTime = await measureExecutionTime(() => {
      for (let i = 0; i < scaledCount; i++) {
        eventBus.emit('effect:applied', { type: 'buff', value: 1 });
      }
    });

    const ratio = scaledTime / baseTime;
    const expectedRatio = scaledCount / baseCount;
    expect(ratio).toBeLessThan(expectedRatio * 1.2);
  });

  test('memory usage remains stable', async () => {
    if (global.gc) {
      const getMemoryUsage = () => {
        global.gc!();
        return process.memoryUsage().heapUsed;
      };

      const initialMemory = getMemoryUsage();
      const gameState = createMockGameState();
      
      for (let i = 0; i < 1000; i++) {
        // Simulate intensive operations
        Object.assign({}, gameState);
      }

      const finalMemory = getMemoryUsage();
      expect(finalMemory - initialMemory).toBeLessThan(1024 * 1024); // 1MB threshold
    }
  });
});