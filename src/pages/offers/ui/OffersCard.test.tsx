import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { Offer } from '../model/types/offer';
import { authActions } from '../../../features/auth/model/authSlice';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { apiClient } from '../../../shared/api/api';
import { commentsApi, offersApi } from '../../../shared/api/client';
import { AuthorizationStatus } from '../../../shared/types/auth';
import { useAppSelector } from '../../../shared/lib/hooks/redux';
import PriceCard from './OffersCard';

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
  isFavorite: false,
  isPremium: false,
  rating: 4,
  ...partial,
});

const createStore = (offer?: Offer) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: offer
      ? { offers: { items: [offer], loading: false, loaded: true, error: null } }
      : undefined,
    middleware: (getDefault) =>
      getDefault({ serializableCheck: false }).concat(
        offersApi.middleware,
        commentsApi.middleware
      ),
  });

  return store;
};

function ConnectedPriceCard({ offerId }: { offerId: string }) {
  const offer = useAppSelector((state) =>
    state.offers.items.find((o) => o.id === offerId)
  );

  return offer ? <PriceCard {...offer} /> : null;
}

describe('PriceCard (OffersCard)', () => {
  it('redirects to /login when user is not authorized', async () => {
    const user = userEvent.setup();
    const store = createStore();
    store.dispatch(authActions.setAuthorizationStatus(AuthorizationStatus.Unauthorized));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<PriceCard {...createOffer()} />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /to bookmarks/i }));

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('toggles favorite state for authorized users', async () => {
    const user = userEvent.setup();
    const offer = createOffer({ id: '1', isFavorite: false });
    const store = createStore(offer);
    store.dispatch(authActions.setAuthorizationStatus(AuthorizationStatus.Authorized));

    const mock = new MockAdapter(apiClient);
    mock
      .onPost(`/favorite/${offer.id}/1`)
      .reply(200, createOffer({ id: offer.id, isFavorite: true }));
    mock
      .onPost(`/favorite/${offer.id}/0`)
      .reply(200, createOffer({ id: offer.id, isFavorite: false }));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<ConnectedPriceCard offerId={offer.id} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    await user.click(bookmarkButton);

    await waitFor(() => {
      expect(store.getState().offers.items[0].isFavorite).toBe(true);
    });

    expect(
      screen.getByRole('button', { name: /in bookmarks/i })
    ).toHaveClass('place-card__bookmark-button--active');

    await user.click(screen.getByRole('button', { name: /in bookmarks/i }));

    await waitFor(() => {
      expect(store.getState().offers.items[0].isFavorite).toBe(false);
    });

    expect(
      screen.getByRole('button', { name: /to bookmarks/i })
    ).not.toHaveClass('place-card__bookmark-button--active');

    mock.restore();
  });
});

