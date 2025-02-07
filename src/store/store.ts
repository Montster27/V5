import { configureStore } from '@reduxjs/toolkit';
import resourceReducer from './resourceSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    resources: resourceReducer,
    events: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;