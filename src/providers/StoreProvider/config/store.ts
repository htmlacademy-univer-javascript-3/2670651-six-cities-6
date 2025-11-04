// src/app/providers/StoreProvider/config/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { commentsApi, offersApi } from '../../../shared/api/client';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().concat(
      offersApi.middleware,
      commentsApi.middleware
    ),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
