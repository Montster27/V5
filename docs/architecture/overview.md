# MMV Architecture Overview

## Core Architecture Principles

1. **Clean Architecture**
   - Domain-driven design
   - Clear separation of concerns
   - Business logic isolation
   - UI/Infrastructure independence

2. **Directory Structure**
```
/src
  /domain          # Business logic and rules
    /entities      # Core business objects
    /services      # Business operations
    /types         # TypeScript types/interfaces
  
  /presentation   # UI layer
    /components   # Reusable UI components
    /layouts      # Page layouts
    /pages        # Full pages/routes
  
  /infrastructure # Technical concerns
    /store        # Redux store
    /api          # External services
    /config       # Configuration
    
  /tests         # All tests
    /unit        # Unit tests
    /integration # Integration tests
    /e2e         # End-to-end tests
```

3. **State Management**
   - Redux for global state
   - React Context for UI state
   - Local state for component-specific concerns

4. **Testing Strategy**
   - Jest for testing framework
   - React Testing Library for component tests
   - Integration tests for features
   - E2E tests for critical paths

## Core Systems

1. **Resource System**
   - Resource generation
   - Resource consumption
   - Resource limits
   - Rate calculations

2. **Time System**
   - Time allocation
   - Activity scheduling
   - Time-based events
   - Pause/resume mechanics

3. **Skill System**
   - Skill progression
   - Skill effects
   - Skill requirements
   - Skill decay

4. **Event System**
   - Event triggers
   - Event processing
   - Event effects
   - Event history

## Development Guidelines

1. **Code Organization**
   - Each feature in its own directory
   - Clear separation of UI and logic
   - Shared components in /components
   - Tests alongside code

2. **State Management**
   - Use Redux for:
     * Resource state
     * Game progress
     * Global settings
   - Use Context for:
     * Theme
     * UI preferences
     * Feature flags
   - Use local state for:
     * Form state
     * UI animations
     * Temporary data

3. **Testing Requirements**
   - Unit tests for all business logic
   - Component tests for UI
   - Integration tests for features
   - E2E tests for critical paths

4. **Documentation Requirements**
   - README for each feature
   - Type documentation
   - Component props documentation
   - Architecture decision records

## Configuration Management

1. **Development Configuration**
   - Environment variables
   - TypeScript configuration
   - Build settings
   - Test setup

2. **Game Configuration**
   - Resource limits
   - Time constraints
   - Skill parameters
   - Event triggers

3. **Tool Configuration**
   - ESLint
   - Prettier
   - Jest
   - Build tools

## Version Control Strategy

1. **Branching Strategy**
   - main: Production code
   - develop: Integration branch
   - feature/*: Feature branches
   - bugfix/*: Bug fixes
   - config/*: Configuration changes

2. **Commit Guidelines**
   - Conventional commits
   - Clear descriptions
   - Reference issues
   - Include tests

3. **Release Process**
   - Version tagging
   - Changelog updates
   - Documentation updates
   - Migration guides