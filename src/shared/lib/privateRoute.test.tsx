import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { rootReducer } from '../../providers/StoreProvider/config/reducer';
import { authActions } from '../../features/auth/model/authSlice';
import { AuthorizationStatus } from '../types/auth';
import PrivateRoute from './privateRoute';

const renderPrivateRoute = (status: AuthorizationStatus) => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(authActions.setAuthorizationStatus(status));

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/favorites']}>
        <Routes>
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <div>Private content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PrivateRoute', () => {
  it('renders a spinner while auth status is unknown', () => {
    renderPrivateRoute(AuthorizationStatus.Unknown);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('renders children for authorized users', () => {
    renderPrivateRoute(AuthorizationStatus.Authorized);

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('redirects to /login for unauthorized users', () => {
    renderPrivateRoute(AuthorizationStatus.Unauthorized);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});

