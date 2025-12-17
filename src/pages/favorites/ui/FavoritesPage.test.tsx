import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Offer } from '../../offers/model/types/offer';
import { FavoritesPage } from './FavoritesPage';

const getFavoritesMock = vi.hoisted(() => vi.fn());

vi.mock('../../../shared/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../shared/api/client')>();
  return {
    ...actual,
    useGetFavoriteOffersQuery: getFavoritesMock,
  };
});

vi.mock('../../offers/ui/OffersCard', () => ({
  default: ({
    title,
    isHorizontal,
  }: {
    title: string;
    isHorizontal?: boolean;
  }) => (
    <div data-testid="price-card" data-horizontal={isHorizontal ? 'true' : 'false'}>
      {title}
    </div>
  ),
}));

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

describe('FavoritesPage', () => {
  beforeEach(() => {
    getFavoritesMock.mockReset();
  });

  it('renders loading state', () => {
    getFavoritesMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<FavoritesPage />);

    expect(screen.getByText('Loading favorites…')).toBeInTheDocument();
  });

  it('renders error state', () => {
    getFavoritesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<FavoritesPage />);

    expect(screen.getByText('Failed to load favorites')).toBeInTheDocument();
  });

  it('renders empty state when there are no favorites', () => {
    getFavoritesMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<FavoritesPage />);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('groups favorites by city and renders horizontal cards', () => {
    getFavoritesMock.mockReturnValue({
      data: [
        createOffer({
          id: 'a1',
          title: 'A1',
          city: {
            name: 'Amsterdam',
            location: { latitude: 1, longitude: 2, zoom: 10 },
          },
        }),
        createOffer({
          id: 'p1',
          title: 'P1',
          city: {
            name: 'Paris',
            location: { latitude: 3, longitude: 4, zoom: 10 },
          },
        }),
        createOffer({
          id: 'a2',
          title: 'A2',
          city: {
            name: 'Amsterdam',
            location: { latitude: 1, longitude: 2, zoom: 10 },
          },
        }),
      ],
      isLoading: false,
      isError: false,
    });

    render(<FavoritesPage />);

    const cityLinks = screen.getAllByRole('link');
    expect(cityLinks[0]).toHaveTextContent('Amsterdam');
    expect(cityLinks[0]).toHaveAttribute('href', '#Amsterdam');
    expect(cityLinks[1]).toHaveTextContent('Paris');
    expect(cityLinks[1]).toHaveAttribute('href', '#Paris');

    const cards = screen.getAllByTestId('price-card');
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card).toHaveAttribute('data-horizontal', 'true');
    });
  });
});
