interface Offer {
  id: number;
  price: number;
  type: string;
  title: string;
  image: string;
  isPremium?: boolean;
  isBookmarked?: boolean;
  rating: number;
}

export const offers: Offer[] = [
  {
    id: 1,
    price: 120,
    type: 'Apartment',
    title: 'Beautiful & luxurious apartment at great location',
    image: 'img/apartment-01.jpg',
    isPremium: true,
    isBookmarked: false,
    rating: 4,
  },
  {
    id: 2,
    price: 80,
    type: 'Room',
    title: 'Wood and stone place',
    image: 'img/room.jpg',
    isPremium: false,
    isBookmarked: true,
    rating: 4,
  },
  {
    id: 3,
    price: 132,
    type: 'Apartment',
    title: 'Canal View Prinsengracht',
    image: 'img/apartment-02.jpg',
    isPremium: false,
    isBookmarked: false,
    rating: 4,
  },
  {
    id: 4,
    price: 180,
    type: 'Apartment',
    title: 'Nice, cozy, warm big bed apartment',
    image: 'img/apartment-03.jpg',
    isPremium: true,
    isBookmarked: false,
    rating: 5,
  },
  {
    id: 5,
    price: 80,
    type: 'Room',
    title: 'Wood and stone place',
    image: 'img/room.jpg',
    isPremium: false,
    isBookmarked: true,
    rating: 4,
  },
];
