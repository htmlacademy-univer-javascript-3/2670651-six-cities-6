export type CityKey =
  | 'MOSCOW'
  | 'PARIS'
  | 'LONDON'
  | 'TOKYO'
  | 'NEW_YORK'
  | 'COLOGNE'
  | 'BRUSSELS'
  | 'AMSTERDAM'
  | 'HAMBURG'
  | 'DUSSELDORF';

export type CityData = {
  key: CityKey;
  title: string;
  lat: number;
  lng: number;
  zoom: number;
};

export const CITY_MAP: Record<CityKey, CityData> = {
  AMSTERDAM: { key: 'AMSTERDAM', title: 'Amsterdam', lat: 52.3676, lng: 4.9041, zoom: 12 },
  PARIS: { key: 'PARIS', title: 'Paris', lat: 48.8566, lng: 2.3522, zoom: 12 },
  COLOGNE: { key: 'COLOGNE', title: 'Cologne', lat: 50.9375, lng: 6.9603, zoom: 12 },
  BRUSSELS: { key: 'BRUSSELS', title: 'Brussels', lat: 50.8503, lng: 4.3517, zoom: 12 },
  HAMBURG: { key: 'HAMBURG', title: 'Hamburg', lat: 53.5511, lng: 9.9937, zoom: 12 },
  DUSSELDORF: { key: 'DUSSELDORF', title: 'Dusseldorf', lat: 51.2277, lng: 6.7735, zoom: 12 },
  MOSCOW: { key: 'MOSCOW', title: 'Moscow', lat: 55.7558, lng: 37.6173, zoom: 11 },
  LONDON: { key: 'LONDON', title: 'London', lat: 51.5074, lng: -0.1278, zoom: 12 },
  TOKYO: { key: 'TOKYO', title: 'Tokyo', lat: 35.6762, lng: 139.6503, zoom: 12 },
  NEW_YORK: { key: 'NEW_YORK', title: 'New York', lat: 40.7128, lng: -74.006, zoom: 12 }
};

export const CITY_KEYS = Object.keys(CITY_MAP) as CityKey[];
