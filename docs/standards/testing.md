# Testing Standards

## Testing Structure

### Directory Organization
```
/src
  /__tests__/
    /unit/          # Unit tests
      /components/  # Component tests
      /store/       # Redux tests
      /utils/       # Utility tests
    /integration/   # Integration tests
    /e2e/          # End-to-end tests
    /performance/   # Performance tests
```

## Test Types

### 1. Unit Tests
- Test individual components and functions
- Isolate from external dependencies
- Mock external services
- Focus on business logic

```typescript
// Component Test Example
describe('ResourceDisplay', () => {
  it('should display current resource values', () => {
    const { getByText } = render(<ResourceDisplay resources={mockResources} />);
    expect(getByText('100')).toBeInTheDocument();
  });

  it('should handle empty resources', () => {
    const { getByText } = render(<ResourceDisplay resources={{}} />);
    expect(getByText('No resources')).toBeInTheDocument();
  });
});

// Redux Test Example
describe('resourceSlice', () => {
  it('should handle initial state', () => {
    expect(resourceReducer(undefined, { type: 'unknown' }))
      .toEqual(initialState);
  });

  it('should handle resource updates', () => {
    const actual = resourceReducer(
      initialState,
      updateResource({ type: 'money', amount: 100 })
    );
    expect(actual.money).toEqual(100);
  });
});
```

### 2. Integration Tests
- Test feature workflows
- Test component interactions
- Use real Redux store
- Limited mocking

```typescript
describe('Resource Management', () => {
  it('should update resources based on time allocation', async () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <TimeAllocation />
        <ResourceDisplay />
      </Provider>
    );

    // Allocate time
    fireEvent.change(getByTestId('work-slider'), { target: { value: 8 } });
    
    // Wait for update
    await waitFor(() => {
      expect(getByText('Money: 100')).toBeInTheDocument();
    });
  });
});
```

### 3. E2E Tests
- Test complete user flows
- No mocking
- Real-world scenarios
- Critical path testing

```typescript
describe('Game Progression', () => {
  it('should progress through a game day', async () => {
    // Start game
    await startGame();
    
    // Allocate time
    await allocateTime('work', 8);
    await allocateTime('study', 4);
    
    // Verify resources
    await expect(page).toHaveText('Money: 100');
    await expect(page).toHaveText('Knowledge: 50');
    
    // Check stress levels
    await expect(page).toHaveText('Stress: 30%');
  });
});
```

### 4. Performance Tests
- Resource calculation speed
- Render performance
- Memory usage
- State updates

```typescript
describe('Performance', () => {
  it('should efficiently calculate resources', () => {
    const start = performance.now();
    
    // Perform calculations
    calculateResources(largeDataSet);
    
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});
```

## Test Writing Guidelines

### 1. Naming Conventions
```typescript
// Component tests
ComponentName.test.tsx

// Hook tests
useHookName.test.ts

// Utility tests
utilityName.test.ts

// Integration tests
feature.integration.test.ts
```

### 2. Test Structure
```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Teardown
  afterEach(() => {
    // Clean up
  });

  // Group related tests
  describe('feature', () => {
    it('should handle normal case', () => {
      // Test
    });

    it('should handle edge case', () => {
      // Test
    });
  });
});
```

### 3. Assertion Guidelines
```typescript
// Prefer specific assertions
expect(value).toBe(100);          // ✓
expect(value).toEqual(100);       // ✓
expect(value === 100).toBe(true); // ✗

// Use appropriate matchers
expect(array).toContain(item);    // ✓
expect(array.includes(item));     // ✗

// Test user interactions
expect(screen.getByRole('button')).toBeEnabled();  // ✓
expect(button.disabled).toBe(false);               // ✗
```

## Test Coverage

### Coverage Requirements
```typescript
// Minimum coverage requirements
{
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80
}
```

### Coverage Reporting
```bash
# Generate coverage report
npm run test:coverage

# Review in browser
open coverage/lcov-report/index.html
```

## Testing Tools

### Core Tools
- Jest: Test runner
- React Testing Library: Component testing
- Jest DOM: DOM assertions
- MSW: API mocking

### Helper Functions
```typescript
// Test utilities
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  } = {}
) => {
  return {
    store,
    ...render(
      <Provider store={store}>{ui}</Provider>,
      renderOptions
    ),
  };
};
```

## Mocking Guidelines

### 1. API Mocking
```typescript
// Mock API responses
const handlers = [
  rest.get('/api/resources', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockResources)
    );
  }),
];
```

### 2. Time Mocking
```typescript
// Mock timers
jest.useFakeTimers();

// Fast-forward time
jest.advanceTimersByTime(1000);

// Restore real timers
jest.useRealTimers();
```

### 3. State Mocking
```typescript
// Mock Redux state
const mockState = {
  resources: {
    money: 100,
    energy: 50
  }
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: mockState
});
```

## Continuous Integration

### Test Running
```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```