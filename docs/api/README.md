# Middle Age Multiverse API Documentation

## Core Systems

### Event System
```typescript
interface GameEvent {
  id: string;
  category: 'daily' | 'pivotal' | 'mystery';
  title: string;
  description: string;
  triggerConditions: TriggerCondition[];
  choices: EventChoice[];
  effects: EventEffect[];
}

// EventManager.handleEventChoice(event: GameEvent, choice: EventChoice)
// Processes player choices in events
```

### Activity System
```typescript
interface Activity {
  id: string;
  type: string;
  duration: number;
  effects: ActivityEffect[];
  requirements?: Requirement[];
}

// ActivityManager.scheduleActivity(activity: Activity)
// Schedules and validates activities
```

### Character Status System
```typescript
interface CharacterState {
  energy: number;
  stress: number;
  belonging: number;
  health: number;
}

// CharacterStatusService.applyEffect(effect: StatusEffect)
// Applies status effects with validation
```

## Event Bus Events

### Time Events
- `time:tick` (delta: number)
- `time:day:changed` (day: number)
- `time:paused`
- `time:resumed`

### Activity Events
- `activity:scheduled` (activity: Activity)
- `activity:started` (activity: Activity)
- `activity:completed` (activity: Activity)
- `activity:cancelled` (activity: Activity)

### Character Events
- `character:status:updated` ({status, effects})
- `effect:applied` (effect: StatusEffect)

### State Events
- `state:save:requested` ({state, slot})
- `state:load:requested` ({slot})
- `state:updated` (state: GameState)

## Usage Examples

### Scheduling Activity
```typescript
const activity = {
  id: 'study_math',
  type: 'study',
  duration: 2,
  effects: [{
    type: 'buff',
    attribute: 'knowledge',
    value: 5
  }]
};

eventBus.emit('activity:scheduled', activity);
```

### Handling Events
```typescript
eventBus.subscribe('character:status:updated', ({ status }) => {
  if (status.stress > 80) {
    eventBus.emit('event:trigger', 'stress_warning');
  }
});
```