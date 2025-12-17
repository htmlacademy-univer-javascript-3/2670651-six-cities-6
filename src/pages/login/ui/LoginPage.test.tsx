import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { AuthorizationStatus } from '../../../shared/types/auth';
import { CITY_KEYS, CITY_MAP } from '../../main/consts/consts';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('enables submit button only when email and password are valid', async () => {
    const user = userEvent.setup();
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          authorizationStatus: AuthorizationStatus.Unauthorized,
          user: null,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const submit = screen.getByRole('button', { name: 'Sign in' });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText('E-mail'), 'test@test.dev');
    await user.type(screen.getByLabelText('Password'), 'password');
    expect(submit).toBeDisabled();

    await user.clear(screen.getByLabelText('Password'));
    await user.type(screen.getByLabelText('Password'), 'pass1');
    expect(submit).toBeEnabled();
  });

  it('navigates to main page and updates city when random city is clicked', async () => {
    const user = userEvent.setup();
    const randomValue = 0.2;
    const expectedKey = CITY_KEYS[Math.floor(randomValue * CITY_KEYS.length)];
    const expectedCity = CITY_MAP[expectedKey];

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(randomValue);

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: {
          authorizationStatus: AuthorizationStatus.Unauthorized,
          user: null,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Main page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await user.click(
      screen.getByRole('button', { name: expectedCity.title })
    );

    expect(screen.getByText('Main page')).toBeInTheDocument();
    expect(store.getState().city.currentCityKey).toBe(expectedKey);

    randomSpy.mockRestore();
  });
});
