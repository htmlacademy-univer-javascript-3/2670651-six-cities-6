// src/app/providers/StoreProvider/config/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { commentsApi, offersApi } from '../../../shared/api/client';
import { apiClient } from '../../../shared/api/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      thunk: {
        extraArgument: apiClient,
      },
    }).concat(offersApi.middleware, commentsApi.middleware),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
