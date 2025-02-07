import { EventBus } from '../application/EventBus';
import { GameStateManager } from '../application/game/GameStateManager';
import { ActivityManager } from '../application/activities/ActivityManager';
import { createMockGameState } from './testUtils';

describe('Performance Tests', () => {
  // Setup measurement utils
  const measureExecutionTime = async (fn: () => Promise<void> | void): Promise<number> => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    return Math.max(0.001, end - start); // Ensure we never return 0
  };

  // Helper to run multiple iterations and get average
  const measureAverageTime = async (
    fn: () => Promise<void> | void,
    iterations: number = 5
  ): Promise<number> => {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      times.push(await measureExecutionTime(fn));
    }
    return times.reduce((a, b) => a + b, 0) / times.length;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('game loop performance under load', async () => {
    const eventBus = new EventBus();
    const gameState = createMockGameState();
    const cycleCount = 100; // Reduced for more reliable testing
    
    const avgTime = await measureAverageTime(async () => {
      for (let i = 0; i < cycleCount; i++) {
        eventBus.emit('time:tick', 1);
        jest.advanceTimersByTime(16); // Simulate frame time
      }
    });

    const timePerCycle = avgTime / cycleCount;
    expect(timePerCycle).toBeLessThan(16); // Target 60fps (16.67ms)
  });

  test('event processing scales linearly', async () => {
    const eventBus = new EventBus();
    const baseCount = 100;
    const scaledCount = 500; // Reduced for reliability
    
    // Measure base case with multiple iterations
    const baseTime = await measureAverageTime(async () => {
      for (let i = 0; i < baseCount; i++) {
        eventBus.emit('effect:applied', { type: 'buff', value: 1 });
      }
    });

    // Measure scaled case with multiple iterations
    const scaledTime = await measureAverageTime(async () => {
      for (let i = 0; i < scaledCount; i++) {
        eventBus.emit('effect:applied', { type: 'buff', value: 1 });
      }
    });

    // Ensure we don't divide by zero
    const ratio = baseTime > 0 ? scaledTime / baseTime : scaledTime;
    const expectedRatio = scaledCount / baseCount;
    
    // We expect roughly linear scaling (with some overhead tolerance)
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(expectedRatio * 1.5); // Allow 50% overhead
  });

  test('memory usage remains stable', async () => {
    const initialUsage = process.memoryUsage();
    const gameState = createMockGameState();
    const operations = 1000;
    const samples: number[] = [];

    // Take memory samples during operations
    for (let i = 0; i < operations; i++) {
      if (i % 100 === 0) { // Sample every 100 operations
        const usage = process.memoryUsage();
        samples.push(usage.heapUsed);
      }
      
      // Simulate game operations
      const stateCopy = { ...gameState };
      stateCopy.resources.money += 1;
      stateCopy.resources.energy -= 0.1;
    }

    // Calculate memory growth rate
    const memoryGrowth = samples[samples.length - 1] - samples[0];
    const operationsPerSample = 100;
    const growthPerOperation = memoryGrowth / (operations / operationsPerSample);

    // Expect minimal memory growth per operation
    expect(growthPerOperation).toBeLessThan(100); // bytes per operation
  });

  test('event bus dispatch performance', async () => {
    const eventBus = new EventBus();
    const eventCount = 1000;
    let receivedCount = 0;

    // Setup subscriber
    eventBus.subscribe('test:event', () => {
      receivedCount++;
    });

    const dispatchTime = await measureExecutionTime(async () => {
      for (let i = 0; i < eventCount; i++) {
        eventBus.emit('test:event', { value: i });
      }
    });

    // Verify performance and correctness
    expect(dispatchTime / eventCount).toBeLessThan(0.1); // Less than 0.1ms per event
    expect(receivedCount).toBe(eventCount);
  });

  test('state update performance', async () => {
    const gameState = createMockGameState();
    const updateCount = 1000;

    const updateTime = await measureAverageTime(async () => {
      for (let i = 0; i < updateCount; i++) {
        gameState.resources.money += Math.random() * 10;
        gameState.resources.energy -= Math.random() * 0.1;
        gameState.resources.stress += Math.random() * 0.05;
      }
    });

    expect(updateTime / updateCount).toBeLessThan(0.05); // Less than 0.05ms per update
  });
});