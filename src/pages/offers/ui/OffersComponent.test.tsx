import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Offer } from '../model/types/offer';
import OffersComponent from './OffersComponent';

vi.mock('./OffersCard', () => ({
  default: ({
    title,
    onMouseOver,
  }: {
    title: string;
    onMouseOver?: () => void;
  }) => (
    <div
      data-testid="price-card"
      onMouseEnter={() => {
        onMouseOver?.();
      }}
    >
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
  isFavorite: false,
  isPremium: false,
  rating: 4,
  ...partial,
});

describe('OffersComponent', () => {
  it('calls onOfferMouseEnter on card hover and onOffersMouseLeave on list mouse leave', () => {
    const offers = [
      createOffer({ id: '1', title: 'Offer 1' }),
      createOffer({ id: '2', title: 'Offer 2' }),
    ];
    const onOfferMouseEnter = vi.fn();
    const onOffersMouseLeave = vi.fn();

    const { container } = render(
      <OffersComponent
        offers={offers}
        onOfferMouseEnter={onOfferMouseEnter}
        onOffersMouseLeave={onOffersMouseLeave}
      />
    );

    const cards = screen.getAllByTestId('price-card');
    expect(cards).toHaveLength(2);

    fireEvent.mouseEnter(cards[0]);
    expect(onOfferMouseEnter).toHaveBeenCalledWith(offers[0]);

    const list = container.firstElementChild as HTMLElement;
    fireEvent.mouseLeave(list);
    expect(onOffersMouseLeave).toHaveBeenCalledTimes(1);
  });
});

