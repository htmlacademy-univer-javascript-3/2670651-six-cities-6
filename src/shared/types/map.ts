import { CityData, CityKey } from '../../pages/main/consts/consts';

export type Point = { title: string; lat: number; lng: number; zoom?: number };
export type Points = Point[];
export type City = CityData;
export type { CityKey };
