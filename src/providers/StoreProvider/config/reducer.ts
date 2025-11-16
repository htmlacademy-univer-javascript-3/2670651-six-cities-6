// src/app/providers/StoreProvider/config/reducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { cityReducer } from '../../../pages/main/model/citySlice';
import { offersReducer } from '../../../pages/offers/model/offersSlice';
import { commentsApi, offersApi } from '../../../shared/api/client';
import { authReducer } from '../../../features/auth/model/authSlice';

export const rootReducer = combineReducers({
  city: cityReducer,
  offers: offersReducer,
  auth: authReducer,
  [offersApi.reducerPath]: offersApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
});

export type RootReducer = typeof rootReducer;
