# System Patterns

## Architecture Overview
The system follows a clean architecture pattern with distinct layers:

### Application Layer
- GameEngine: Core game loop and system orchestration
- GameStateManager: Manages game state and updates
- EventManager: Handles game events and activity tracking

### Domain Layer
- StressEnergyService: Manages stress and energy mechanics
- TimeState: Handles game time progression and allocation
- EventTypes: Defines event structure and types
- GameError: Custom error handling system

### Infrastructure Layer
- Persistence services for each system
- Error handling and recovery mechanisms
- Event bus implementation

### Presentation Layer
- React components for UI
  - GameInterface: Main container
  - ResourceDisplay: Shows player resources
  - EventDisplay: Central event handling
  - TimeAllocation: Daily schedule management
  - NewsGossip: Information feed
  - StressEnergyDisplay: Status tracking
- Custom hooks for game state management
- Error display and user feedback systems

## Key Technical Decisions
- TypeScript for type safety
- React for UI with functional components
- Clean Architecture for separation of concerns
- Event-driven design for game mechanics
- Comprehensive error handling
- Tailwind CSS for styling
- ShadcnUI for component base

## Design Patterns
- Observer Pattern: For event handling
- Command Pattern: For activity execution
- Strategy Pattern: For game mechanics
- Repository Pattern: For data persistence
- Factory Pattern: For entity creation