import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { Offer } from '../../../pages/offers/model/types/offer';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { apiClient } from '../../api/api';
import { commentsApi, offersApi } from '../../api/client';
import { AuthorizationStatus } from '../../types/auth';
import { Header } from './Header';

const createOffer = (partial?: Partial<Offer>): Offer => ({
  id: 'offer-id',
  title: 'Title',
  type: 'apartment',
  price: 100,
  previewImage: 'img.jpg',
  city: {
    name: 'Amsterdam',
    location: { latitude: 52.3, longitude: 4.9, zoom: 10 },
  },
  location: { latitude: 52.3, longitude: 4.9, zoom: 10 },
  isFavorite: true,
  isPremium: false,
  rating: 4,
  ...partial,
});

const createStore = (status: AuthorizationStatus) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: {
        authorizationStatus: status,
        user:
          status === AuthorizationStatus.Authorized
            ? {
              id: 1,
              email: 'user@test.dev',
              name: 'User',
              avatarUrl: '/img/avatar.jpg',
              isPro: false,
              token: 'token',
            }
            : null,
        error: null,
      },
    },
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: false,
        thunk: { extraArgument: apiClient },
      }).concat(offersApi.middleware, commentsApi.middleware),
  });

describe('Header', () => {
  it('renders Sign in for unauthorized users', () => {
    const mock = new MockAdapter(apiClient);
    const store = createStore(AuthorizationStatus.Unauthorized);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
    expect(mock.history.get).toHaveLength(0);

    mock.restore();
  });

  it('shows favorite count for authorized users and logs out on click', async () => {
    const user = userEvent.setup();
    const mock = new MockAdapter(apiClient);

    mock
      .onGet('/favorite')
      .reply(200, [createOffer({ id: '1' }), createOffer({ id: '2' })]);
    mock.onDelete('/logout').reply(204);

    const store = createStore(AuthorizationStatus.Authorized);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('user@test.dev')).toBeInTheDocument();
    expect(
      await screen.findByText((content, element) =>
        element?.classList.contains('header__favorite-count')
          ? content === '2'
          : false
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(await screen.findByText('Sign in')).toBeInTheDocument();
    expect(store.getState().auth.authorizationStatus).toBe(
      AuthorizationStatus.Unauthorized
    );
    expect(mock.history.delete).toHaveLength(1);

    mock.restore();
  });
});
