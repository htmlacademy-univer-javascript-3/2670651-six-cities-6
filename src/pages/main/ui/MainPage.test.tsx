import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';

import type { Offer } from '../../offers/model/types/offer';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { MainPage } from './MainPage';

vi.mock('../../../shared/ui/LeafletMap/ui/LeafletMap', () => ({
  default: () => <div data-testid="map" />,
}));

vi.mock('../../offers/ui/OffersComponent', () => ({
  default: () => <div data-testid="offers-component" />,
}));

const createOffer = (partial?: Partial<Offer>): Offer => ({
  id: 'offer-id',
  title: 'Title',
  type: 'apartment',
  price: 100,
  previewImage: 'img.jpg',
  city: {
    name: 'Paris',
    location: { latitude: 48.85, longitude: 2.35, zoom: 10 },
  },
  location: { latitude: 48.85, longitude: 2.35, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  ...partial,
});

describe('MainPage', () => {
  it('renders empty state when offers list is empty', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        offers: { items: [], loading: false, loaded: true, error: null },
      },
    });

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(
      screen.getByText('No places to stay available')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('map')).not.toBeInTheDocument();
    expect(screen.queryByTestId('offers-component')).not.toBeInTheDocument();
  });

  it('renders offers list and map when there are offers', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        offers: {
          items: [createOffer()],
          loading: false,
          loaded: true,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(
      screen.getByText('1 place to stay in Paris')
    ).toBeInTheDocument();
    expect(screen.getByTestId('offers-component')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
