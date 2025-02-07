import { configureStore, Store } from '@reduxjs/toolkit';
import resourceReducer, {
  updateResources,
  modifyResources,
  resetResources,
} from '../store/resourceSlice';
import eventReducer, {
  setCurrentEvent,
  clearCurrentEvent,
  resetEvents,
} from '../store/eventSlice';
import { mockEvent } from './testUtils';
import { RootState } from '../store/store';

describe('Resource Slice', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        resources: resourceReducer,
        events: eventReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState() as RootState;
    expect(state.resources).toEqual({
      money: 1000,
      knowledge: 0,
      socialPoints: 0,
      energy: 100,
      stress: 0,
    });
  });

  it('should handle updateResources', () => {
    store.dispatch(updateResources({
      money: 2000,
      energy: 80,
    }));

    const state = store.getState() as RootState;
    expect(state.resources.money).toBe(2000);
    expect(state.resources.energy).toBe(80);
  });

  it('should handle modifyResources', () => {
    const state = store.getState() as RootState;
    const initialMoney = state.resources.money;
    
    store.dispatch(modifyResources({
      money: 500,
      energy: -20,
    }));

    const newState = store.getState() as RootState;
    expect(newState.resources.money).toBe(initialMoney + 500);
    expect(newState.resources.energy).toBe(80);
  });

  it('should handle resetResources', () => {
    store.dispatch(updateResources({
      money: 5000,
      knowledge: 100,
    }));
    
    store.dispatch(resetResources());

    const state = store.getState() as RootState;
    expect(state.resources).toEqual({
      money: 1000,
      knowledge: 0,
      socialPoints: 0,
      energy: 100,
      stress: 0,
    });
  });
});

describe('Event Slice', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        resources: resourceReducer,
        events: eventReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState() as RootState;
    expect(state.events).toEqual({
      currentEvent: null,
      eventHistory: [],
    });
  });

  it('should handle setCurrentEvent', () => {
    const event = mockEvent();
    store.dispatch(setCurrentEvent(event));

    const state = store.getState() as RootState;
    expect(state.events.currentEvent).toEqual(event);
    expect(state.events.eventHistory).toEqual([]);
  });

  it('should handle clearCurrentEvent', () => {
    const event = mockEvent();
    store.dispatch(setCurrentEvent(event));
    store.dispatch(clearCurrentEvent());

    const state = store.getState() as RootState;
    expect(state.events.currentEvent).toBeNull();
    expect(state.events.eventHistory).toContain(event.id);
  });

  it('should handle resetEvents', () => {
    const event = mockEvent();
    store.dispatch(setCurrentEvent(event));
    store.dispatch(resetEvents());

    const state = store.getState() as RootState;
    expect(state.events).toEqual({
      currentEvent: null,
      eventHistory: [],
    });
  });

  it('should maintain event history when setting new events', () => {
    const firstEvent = { ...mockEvent(), id: 'event1' };
    const secondEvent = { ...mockEvent(), id: 'event2' };

    store.dispatch(setCurrentEvent(firstEvent));
    store.dispatch(setCurrentEvent(secondEvent));

    const state = store.getState() as RootState;
    expect(state.events.currentEvent).toEqual(secondEvent);
    expect(state.events.eventHistory).toContain(firstEvent.id);
  });
});
