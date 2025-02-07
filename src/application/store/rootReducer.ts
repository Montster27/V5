import { timeSlice } from './slices/timeSlice';
import { resourceSlice } from './slices/resourceSlice';
import { characterSlice } from './slices/characterSlice';
import { eventSlice } from './slices/eventSlice';
import { RootState } from './index';
import { AnyAction, Reducer, combineReducers } from '@reduxjs/toolkit';

const combinedReducer = combineReducers({
  time: timeSlice.reducer,
  resources: resourceSlice.reducer,
  character: characterSlice.reducer,
  events: eventSlice.reducer,
});

export const rootReducer: Reducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === 'LOAD_GAME') {
    // Merge the loaded state with initial state to ensure no missing fields
    return {
      time: {
        ...timeSlice.getInitialState(),
        ...action.payload.time
      },
      resources: {
        ...resourceSlice.getInitialState(),
        ...action.payload.resources
      },
      character: {
        ...characterSlice.getInitialState(),
        ...action.payload.character
      },
      events: {
        ...eventSlice.getInitialState(),
        ...action.payload.events
      }
    };
  }
  
  if (action.type === 'RESET_GAME') {
    // Reset to initial state
    return {
      time: timeSlice.getInitialState(),
      resources: resourceSlice.getInitialState(),
      character: characterSlice.getInitialState(),
      events: eventSlice.getInitialState(),
    };
  }

  return combinedReducer(state, action);
};