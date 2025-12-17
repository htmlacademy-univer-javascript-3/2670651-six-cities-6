import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import type { Offer } from './types/offer';
import { fetchOffers, offersReducer } from './offersSlice';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { apiClient } from '../../../shared/api/api';
import { commentsApi, offersApi } from '../../../shared/api/client';

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

describe('offersSlice reducer', () => {
  it('should return initial state on unknown action', () => {
    const state = offersReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      items: [],
      loading: false,
      loaded: false,
      error: null,
    });
  });

  it('should handle fetchOffers.pending', () => {
    const state = offersReducer(undefined, fetchOffers.pending('rq1', undefined));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOffers.fulfilled', () => {
    const offers: Offer[] = [createOffer({ id: '1' }), createOffer({ id: '2' })];
    const state = offersReducer(
      undefined,
      fetchOffers.fulfilled(offers, 'rq1', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.loaded).toBe(true);
    expect(state.items).toEqual(offers);
  });

  it('should handle fetchOffers.rejected', () => {
    const state = offersReducer(
      undefined,
      fetchOffers.rejected(new Error('boom'), 'rq1', undefined, 'Failed')
    );

    expect(state.loading).toBe(false);
    expect(state.loaded).toBe(true);
    expect(state.error).toBe('Failed');
  });

  it('should update isFavorite on toggleFavorite success', async () => {
    const offer = createOffer({ id: 'favorite-offer', isFavorite: false });
    const updatedOffer = createOffer({ id: offer.id, isFavorite: true });

    const mock = new MockAdapter(apiClient);
    mock.onPost(`/favorite/${offer.id}/1`).reply(200, updatedOffer);

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        offers: { items: [offer], loading: false, loaded: true, error: null },
      },
      middleware: (getDefault) =>
        getDefault({
          thunk: { extraArgument: apiClient },
          serializableCheck: false,
        }).concat(offersApi.middleware, commentsApi.middleware),
    });

    await store
      .dispatch(
        offersApi.endpoints.toggleFavorite.initiate({
          offerId: offer.id,
          status: 1,
        })
      )
      .unwrap();

    expect(store.getState().offers.items[0].isFavorite).toBe(true);

    mock.restore();
  });
});

