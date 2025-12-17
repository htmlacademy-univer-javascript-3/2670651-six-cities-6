import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { AppRouter } from './AppRouter';
import { rootReducer } from '../providers/StoreProvider/config/reducer';
import { apiClient } from '../shared/api/api';
import { commentsApi, offersApi } from '../shared/api/client';
import { AuthorizationStatus } from '../shared/types/auth';

const createTestStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      offers: { items: [], loading: false, loaded: true, error: null },
      auth: { authorizationStatus: AuthorizationStatus.Unauthorized, user: null, error: null },
    },
    middleware: (getDefault) =>
      getDefault({
        thunk: { extraArgument: apiClient },
        serializableCheck: false,
      }).concat(offersApi.middleware, commentsApi.middleware),
  });

const renderWithRoute = (path: string) => {
  window.history.pushState({}, '', path);
  const store = createTestStore();

  return render(
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  window.history.pushState({}, '', '/');
});

describe('AppRouter', () => {
  it('renders LoginPage on /login', async () => {
    renderWithRoute('/login');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('redirects to /login from /favorites for unauthorized user', async () => {
    renderWithRoute('/favorites');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders MainPage empty state on /', async () => {
    renderWithRoute('/');

    expect(await screen.findByText('No places to stay available')).toBeInTheDocument();
  });

  it('redirects unknown route to /404', async () => {
    renderWithRoute('/some-unknown-route');

    expect(
      await screen.findByRole('heading', { name: /404/i })
    ).toBeInTheDocument();
  });
});

