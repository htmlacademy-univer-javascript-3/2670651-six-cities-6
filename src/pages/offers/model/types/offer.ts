interface Location {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface City {
  name: string;
  location: Location;
}

export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
}

