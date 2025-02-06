import { ActivityEffectService } from '../domain/activities/ActivityEffectService';
import { ActivityManager } from '../application/activities/ActivityManager';
import { MockEventBus } from './testUtils';
import { CharacterStatusManager } from '../application/character/CharacterStatusManager';

describe('Activity Effects', () => {
  let effectService: ActivityEffectService;
  let activityManager: ActivityManager;
  let eventBus: MockEventBus;

  beforeEach(() => {
    const effects = new Map([
      ['study', [{
        id: 'study_effect',
        type: 'duration',
        effects: [
          { type: 'buff', attribute: 'knowledge', value: 5, duration: 0, source: 'study' },
          { type: 'debuff', attribute: 'energy', value: 10, duration: 0, source: 'study' }
        ]
      }]]
    ]);

    effectService = new ActivityEffectService(effects);
    eventBus = new MockEventBus();
    activityManager = new ActivityManager(
      effectService,
      {} as CharacterStatusManager,
      eventBus as any
    );
  });

  test('applies effects on activity start', () => {
    const emittedEffects: any[] = [];
    eventBus.subscribe('effect:applied', (effect) => {
      emittedEffects.push(effect);
    });

    const activity = {
      type: 'study',
      duration: 2
    };

    eventBus.emit('activity:started', activity);
    expect(emittedEffects.length).toBe(2);
  });
});