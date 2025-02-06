# Error Handling

## Common Error Types

### Activity Errors
```typescript
class ActivitySchedulingError extends Error {
  constructor(message: string, public activity: Activity) {
    super(message);
  }
}

class ActivityRequirementError extends Error {
  constructor(message: string, public requirement: Requirement) {
    super(message);
  }
}
```

### State Errors
```typescript
class StateValidationError extends Error {
  constructor(message: string, public state: Partial<GameState>) {
    super(message);
  }
}

class StatePersistenceError extends Error {
  constructor(message: string, public operation: 'save' | 'load') {
    super(message);
  }
}
```

## Error Events
- `error:activity` (ActivitySchedulingError | ActivityRequirementError)
- `error:state` (StateValidationError | StatePersistenceError)
- `error:system` (Error)

## Error Handling Examples
```typescript
eventBus.subscribe('error:activity', (error) => {
  if (error instanceof ActivitySchedulingError) {
    // Handle scheduling error
    logger.error('Activity scheduling failed', {
      activity: error.activity,
      message: error.message
    });
  }
});

try {
  await saveManager.saveState(gameState);
} catch (error) {
  if (error instanceof StatePersistenceError) {
    eventBus.emit('error:state', error);
  }
}
```