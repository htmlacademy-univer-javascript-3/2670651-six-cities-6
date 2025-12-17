import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';

import type { Offer } from './types/offer';
import { fetchOffers, offersReducer } from './offersSlice';

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

describe('fetchOffers thunk', () => {
  it('should store offers on success', async () => {
    const offers: Offer[] = [createOffer({ id: '1' }), createOffer({ id: '2' })];
    const api = {
      get: vi.fn().mockResolvedValue({ data: offers }),
    } as unknown as AxiosInstance;

    const store = configureStore({
      reducer: offersReducer,
      middleware: (getDefault) => getDefault({ thunk: { extraArgument: api } }),
    });

    const action = await store.dispatch(fetchOffers());

    expect(fetchOffers.fulfilled.match(action)).toBe(true);
    expect(store.getState().items).toEqual(offers);
    expect(store.getState().loaded).toBe(true);
  });

  it('should store error message on failure', async () => {
    const api = {
      get: vi.fn().mockRejectedValue(new Error('Failed')),
    } as unknown as AxiosInstance;

    const store = configureStore({
      reducer: offersReducer,
      middleware: (getDefault) => getDefault({ thunk: { extraArgument: api } }),
    });

    const action = await store.dispatch(fetchOffers());

    expect(fetchOffers.rejected.match(action)).toBe(true);
    expect(action.payload).toBe('Failed');
    expect(store.getState().error).toBe('Failed');
    expect(store.getState().loaded).toBe(true);
  });
});

