import '@testing-library/jest-dom';
import { performanceMonitor } from '../infrastructure/monitoring/PerformanceMonitor';
import { errorHandler } from '../infrastructure/error/ErrorHandler';

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Performance monitoring setup
beforeEach(() => {
  performanceMonitor.clearMetrics();
});

// Error handling setup
beforeEach(() => {
  errorHandler.clearErrorLog();
});

// Mock window.performance
const originalPerformance = global.performance;
beforeAll(() => {
  global.performance = {
    ...originalPerformance,
    now: jest.fn(() => Date.now()),
  };
});

afterAll(() => {
  global.performance = originalPerformance;
});

// Utility functions for testing
export const waitForPerformanceMetric = (type: string): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const metric = performanceMonitor.getAverageMetric(type);
      resolve(metric);
    }, 0);
  });
};

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      resources: resourceReducer,
      events: eventReducer,
      skills: skillReducer,
      // Add other reducers as needed
    },
    preloadedState: initialState,
  });
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    store = createTestStore(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Custom async utilities
export const waitForResourceUpdate = async (
  store: ReturnType<typeof createTestStore>,
  resourceName: string,
  expectedValue: number,
  timeout = 1000
) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const currentValue = store.getState().resources[resourceName];
    if (currentValue === expectedValue) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  throw new Error(`Resource ${resourceName} did not update to ${expectedValue} within ${timeout}ms`);
};

// Test data generators
export const generateTestEvent = (overrides = {}) => ({
  id: 'test-event-' + Math.random().toString(36).substr(2, 9),
  title: 'Test Event',
  description: 'Test event description',
  choices: [
    {
      id: 'choice1',
      text: 'Choice 1',
      effects: { money: -10, social: 5 }
    },
    {
      id: 'choice2',
      text: 'Choice 2',
      effects: { money: 10, social: -5 }
    }
  ],
  timeLimit: 30,
  ...overrides
});

export const generateTestResource = (overrides = {}) => ({
  money: 1000,
  social: 50,
  knowledge: 30,
  energy: 100,
  stress: 0,
  ...overrides
});

// Mock service responses
export class MockResourceService {
  private resources: Record<string, number> = generateTestResource();

  getResource(name: string): number {
    return this.resources[name] ?? 0;
  }

  setResource(name: string, value: number): void {
    this.resources[name] = value;
  }

  updateResource(name: string, delta: number): void {
    this.resources[name] = (this.resources[name] ?? 0) + delta;
  }
}

export class MockEventService {
  private currentEvent: any = null;
  private eventHistory: any[] = [];

  triggerEvent(type: string, data: any) {
    const event = generateTestEvent({ type, ...data });
    this.currentEvent = event;
    return { success: true, event };
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  getEventHistory() {
    return [...this.eventHistory];
  }
}

// Error assertion utilities
export const expectNoErrors = () => {
  expect(errorHandler.getErrorLog()).toHaveLength(0);
};

export const expectError = (type: string, level: string) => {
  const errors = errorHandler.getErrorLog();
  expect(errors).toContainEqual(
    expect.objectContaining({
      type,
      level
    })
  );
};

// Performance assertion utilities
export const expectPerformanceWithin = async (metricType: string, maxTime: number) => {
  const metric = await waitForPerformanceMetric(metricType);
  expect(metric).toBeLessThan(maxTime);
};

// Add missing imports
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { resourceReducer } from '../application/store/resourceSlice';
import { eventReducer } from '../application/store/eventSlice';
import { skillReducer } from '../application/store/skillSlice';