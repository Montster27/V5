# System Patterns

## Core Testing Patterns

### Component Testing
- Use React Testing Library
- Add proper data-testid attributes
- Test user interactions
- Test accessibility
- Add proper cleanup

### Performance Testing
- Use reliable measurement methods
- Average multiple samples
- Add proper timer mocking
- Test memory usage
- Test event processing

### Integration Testing
- Test complete workflows
- Mock only external dependencies
- Test error conditions
- Test concurrent operations
- Test state preservation

## Implementation Patterns

### Time Management
- Track hours and days
- Handle day transitions
- Update state atomically
- Trigger time-based events

### Resource Management
- Enforce resource constraints
- Handle concurrent updates
- Validate all changes
- Track historical changes

### Error Handling
- Add proper boundaries
- Log all errors
- Provide fallbacks
- Clean up on errors

## Organization

### Test Structure
```
src/
└── tests/
    ├── components/      # Component tests
    ├── integration/     # Integration tests
    ├── performance/     # Performance tests
    └── utils/          # Test utilities
```

### Implementation Structure
```
src/
├── domain/
│   ├── services/
│   └── integration/
├── application/
│   └── game/
└── presentation/
    └── components/
```