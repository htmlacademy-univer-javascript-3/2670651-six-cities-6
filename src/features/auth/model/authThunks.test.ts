import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import { authReducer, checkAuth } from './authSlice';
import { AuthorizationStatus } from '../../../shared/types/auth';
import type { AuthInfo } from '../../../shared/types/auth';

const createUser = (partial?: Partial<AuthInfo>): AuthInfo => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'avatar.png',
  isPro: false,
  token: 'token',
  ...partial,
});

describe('checkAuth thunk', () => {
  it('should set Authorized on success', async () => {
    const user = createUser();
    const api = {
      get: vi.fn().mockResolvedValue({ data: user }),
    } as unknown as AxiosInstance;

    const store = configureStore({
      reducer: authReducer,
      middleware: (getDefault) => getDefault({ thunk: { extraArgument: api } }),
    });

    const action = await store.dispatch(checkAuth());

    expect(checkAuth.fulfilled.match(action)).toBe(true);
    expect(store.getState().authorizationStatus).toBe(
      AuthorizationStatus.Authorized
    );
    expect(store.getState().user).toEqual(user);
  });

  it('should set Unauthorized on 401', async () => {
    const api = {
      get: vi.fn().mockRejectedValue({ response: { status: 401 } }),
    } as unknown as AxiosInstance;

    const store = configureStore({
      reducer: authReducer,
      middleware: (getDefault) => getDefault({ thunk: { extraArgument: api } }),
    });

    const action = await store.dispatch(checkAuth());

    expect(checkAuth.rejected.match(action)).toBe(true);
    expect(action.payload).toBe('Not authorized');
    expect(store.getState().authorizationStatus).toBe(
      AuthorizationStatus.Unauthorized
    );
    expect(store.getState().user).toBeNull();
  });
});

