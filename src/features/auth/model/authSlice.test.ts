import { describe, expect, it } from 'vitest';
import { authActions, authReducer, checkAuth, login, logout } from './authSlice';
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

describe('authSlice reducer', () => {
  it('should return initial state on unknown action', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      user: null,
      error: null,
    });
  });

  it('should set authorization status', () => {
    const state = authReducer(
      undefined,
      authActions.setAuthorizationStatus(AuthorizationStatus.Authorized)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Authorized);
  });

  it('should reset auth error', () => {
    const stateWithError = {
      authorizationStatus: AuthorizationStatus.Unauthorized,
      user: null,
      error: 'Some error',
    };

    const state = authReducer(stateWithError, authActions.resetAuthError());

    expect(state.error).toBeNull();
  });

  it('should handle checkAuth.fulfilled', () => {
    const user = createUser();
    const state = authReducer(
      undefined,
      checkAuth.fulfilled(user, 'rq1', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Authorized);
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull();
  });

  it('should handle checkAuth.rejected', () => {
    const state = authReducer(
      undefined,
      checkAuth.rejected(new Error('fail'), 'rq1', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Unauthorized);
    expect(state.user).toBeNull();
  });

  it('should handle login.fulfilled', () => {
    const user = createUser({ email: 'login@example.com' });
    const state = authReducer(undefined, login.fulfilled(user, 'rq1', {
      email: 'login@example.com',
      password: 'password1',
    }));

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Authorized);
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull();
  });

  it('should handle login.rejected with payload', () => {
    const state = authReducer(
      undefined,
      login.rejected(
        new Error('fail'),
        'rq1',
        { email: 'login@example.com', password: 'password1' },
        'Invalid credentials'
      )
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Unauthorized);
    expect(state.user).toBeNull();
    expect(state.error).toBe('Invalid credentials');
  });

  it('should handle logout.fulfilled', () => {
    const state = authReducer(
      {
        authorizationStatus: AuthorizationStatus.Authorized,
        user: createUser(),
        error: 'err',
      },
      logout.fulfilled(undefined, 'rq1', undefined)
    );

    expect(state.authorizationStatus).toBe(AuthorizationStatus.Unauthorized);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });
});

