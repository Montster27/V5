# Stress & Energy System Documentation

## Time-Based Calculation Challenges & Solutions

### Key Challenge: Time Period Management
The main challenge we encountered was handling calculations across different time periods. Two specific issues emerged:

1. **Single Hour vs Multi-Hour Periods**
   ```typescript
   // Test Case
   const activity = createActivity({ type: 'study', duration: 7 });
   const change = calculator.calculateStressChange([activity], HOUR_IN_MS);
   // Should give (7-6)*2 = 2 stress points
   ```

   **Solution:**
   - Separated activity duration from time period
   - Activity duration determines base stress/energy changes
   - Time period only affects certain penalties (social deficit, rest deficit)

   ```typescript
   // Implementation
   if (studyHours > 6) {
     totalStress += (studyHours - 6) * 2;  // Based on duration only
   }
   
   if (socialHours < 2 && timeElapsed >= 8 * HOUR_IN_MS) {
     totalStress += 5;  // Time period dependent
   }
   ```

2. **Accumulation vs One-Time Penalties**
   - Energy drain accumulates per hour
   - Stress penalties are one-time calculations based on thresholds
   
   ```typescript
   // Energy accumulates
   let change = -5 * activeHours;
   
   // Stress uses thresholds
   if (workHours > 8) {
     totalStress += (workHours - 8) * 2;
   }
   ```

### Rules for Time-Based Calculations

1. **Base Resource Changes (Energy)**
   - Always scale with time period
   - Use linear accumulation
   ```typescript
   if (timeElapsed < HOUR_IN_MS) {
     change *= (timeElapsed / HOUR_IN_MS);
   }
   ```

2. **Threshold-Based Penalties (Stress)**
   - Calculate based on total duration
   - Apply only when minimum time period is met
   ```typescript
   // Social deficit only applies in 8+ hour periods
   if (socialHours < 2 && timeElapsed >= 8 * HOUR_IN_MS) {
     totalStress += 5;
   }
   ```

3. **Multiple Activity Handling**
   - Sum durations per activity type first
   - Then apply calculations to totals
   ```typescript
   const studyHours = activities.reduce((sum, activity) => 
     activity.type === 'study' ? sum + activity.duration : sum, 0);
   ```

## Integration with Game Systems

### Resource Generation Impact
```typescript
interface ResourceGenerationModifiers {
  efficiency: number;
  stressMultiplier: number;
  energyRequirement: number;
}

const calculateEfficiency = (stressEnergy: StressEnergy): number => {
  return Math.max(0.1, (1 - stressEnergy.stress/200) * (stressEnergy.energy/100));
};
```

### Event System Integration
```typescript
interface StressEnergyEvent {
  type: 'burnout' | 'exhaustion' | 'recovery';
  threshold: number;
  duration: number;
}

// Example event trigger
if (energy < 20 || stress > 80) {
  eventSystem.trigger({
    type: 'burnout',
    threshold: energy < 20 ? energy : stress,
    duration: timeElapsed
  });
}
```

### State Management Integration
```typescript
interface GameState {
  stressEnergy: StressEnergyState;
  resources: ResourceState;
  events: EventState;
}

// Update cycle
const updateGameState = (state: GameState, delta: number) => {
  const newStressEnergy = stressEnergyService.calculateNewState(
    state.stressEnergy,
    state.events.currentActivities,
    delta
  );
  
  const efficiency = stressEnergyService.calculateEfficiency(newStressEnergy);
  const newResources = resourceService.updateResources(
    state.resources,
    efficiency,
    delta
  );
  
  return {
    ...state,
    stressEnergy: newStressEnergy,
    resources: newResources
  };
};
```

## Edge Cases and Limitations

1. **Zero Duration Activities**
   - Skip calculations if timeElapsed is 0
   - Return current state without changes

2. **Very Long Time Periods**
   - No special capping needed as stress uses thresholds
   - Energy changes scale linearly

3. **Multiple Activity Types**
   - Calculate each type separately then combine
   - Avoid order dependency in calculations

4. **Rest Interactions**
   - Rest can zero out stress if duration ≥ 8 hours
   - Rest deficit affects energy but not stress directly