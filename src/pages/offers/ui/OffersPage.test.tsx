import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OfferPage } from '../model/types/offers-page';
import { authActions } from '../../../features/auth/model/authSlice';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { AuthorizationStatus } from '../../../shared/types/auth';
import { OffersPage } from './OffersPage';

const apiHooksMock = vi.hoisted(() => ({
  useGetOfferByIdQuery: vi.fn(),
  useGetNearbyOffersQuery: vi.fn(),
  useToggleFavoriteMutation: vi.fn(),
}));

vi.mock('../../../shared/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../shared/api/client')>();
  return {
    ...actual,
    useGetOfferByIdQuery: apiHooksMock.useGetOfferByIdQuery,
    useGetNearbyOffersQuery: apiHooksMock.useGetNearbyOffersQuery,
    useToggleFavoriteMutation: apiHooksMock.useToggleFavoriteMutation,
  };
});

vi.mock('../../../shared/ui/LeafletMap/ui/LeafletMap', () => ({
  default: () => <div data-testid="map" />,
}));

vi.mock('../../../shared/ui/Comment/CommentList', () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="comment-list">{children}</div>
  ),
}));

vi.mock('../../../shared/ui/Comment/CommentForm', () => ({
  default: () => <div data-testid="comment-form" />,
}));

vi.mock('./OffersCard', () => ({
  default: () => <div data-testid="nearby-card" />,
}));

const createOfferPage = (partial?: Partial<OfferPage>): OfferPage => ({
  id: 'offer-1',
  title: 'Offer title',
  type: 'apartment',
  price: 100,
  city: {
    name: 'Amsterdam',
    location: { latitude: 52.3, longitude: 4.9, zoom: 10 },
  },
  location: { latitude: 52.3, longitude: 4.9, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  description: 'Description',
  bedrooms: 1,
  goods: ['Wi-Fi'],
  host: {
    name: 'Host',
    avatarUrl: '/img/avatar.jpg',
    isPro: false,
  },
  images: ['/img/1.jpg'],
  maxAdults: 2,
  ...partial,
});

const createStoreWithStatus = (status: AuthorizationStatus) => {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(authActions.setAuthorizationStatus(status));
  return store;
};

describe('OffersPage', () => {
  beforeEach(() => {
    apiHooksMock.useGetOfferByIdQuery.mockReset();
    apiHooksMock.useGetNearbyOffersQuery.mockReset();
    apiHooksMock.useToggleFavoriteMutation.mockReset();

    apiHooksMock.useGetNearbyOffersQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    apiHooksMock.useToggleFavoriteMutation.mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);
  });

  it('redirects to /404 when offer query returns 404', () => {
    apiHooksMock.useGetOfferByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 404 },
    });

    const store = createStoreWithStatus(AuthorizationStatus.Unauthorized);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/offer-1']}>
          <Routes>
            <Route path="/offer/offer-1" element={<OffersPage id="offer-1" />} />
            <Route path="/404" element={<div>404 page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404 page')).toBeInTheDocument();
  });

  it('shows comment form only for authorized users', () => {
    apiHooksMock.useGetOfferByIdQuery.mockReturnValue({
      data: createOfferPage(),
      isLoading: false,
      isError: false,
      error: undefined,
    });

    const authorizedStore = createStoreWithStatus(AuthorizationStatus.Authorized);
    const unauthorizedStore = createStoreWithStatus(
      AuthorizationStatus.Unauthorized
    );

    const { rerender } = render(
      <Provider store={authorizedStore}>
        <MemoryRouter initialEntries={['/offer/offer-1']}>
          <Routes>
            <Route path="/offer/offer-1" element={<OffersPage id="offer-1" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('comment-form')).toBeInTheDocument();

    rerender(
      <Provider store={unauthorizedStore}>
        <MemoryRouter initialEntries={['/offer/offer-1']}>
          <Routes>
            <Route path="/offer/offer-1" element={<OffersPage id="offer-1" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
  });

  it('redirects to /login when bookmark is clicked by a guest', async () => {
    const user = userEvent.setup();

    apiHooksMock.useGetOfferByIdQuery.mockReturnValue({
      data: createOfferPage({ isFavorite: false }),
      isLoading: false,
      isError: false,
      error: undefined,
    });

    const store = createStoreWithStatus(AuthorizationStatus.Unauthorized);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/offer-1']}>
          <Routes>
            <Route path="/offer/offer-1" element={<OffersPage id="offer-1" />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /to bookmarks/i }));

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});

