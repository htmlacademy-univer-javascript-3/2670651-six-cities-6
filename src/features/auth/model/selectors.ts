import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../providers/StoreProvider/config/store';
import { AuthorizationStatus } from '../../../shared/types/auth';
import type { AuthState } from './authSlice';

const selectAuthState = (state: RootState): AuthState => state.auth;

export const selectAuthorizationStatus = createSelector<
  [typeof selectAuthState],
  AuthorizationStatus
>([selectAuthState], (auth) => auth.authorizationStatus);

export const selectAuthUser = createSelector<
  [typeof selectAuthState],
  AuthState['user']
>([selectAuthState], (auth) => auth.user);

export const selectAuthError = createSelector<
  [typeof selectAuthState],
  AuthState['error']
>([selectAuthState], (auth) => auth.error);

export const selectIsAuthorized = createSelector(
  [selectAuthorizationStatus],
  (status) => status === AuthorizationStatus.Authorized
);
