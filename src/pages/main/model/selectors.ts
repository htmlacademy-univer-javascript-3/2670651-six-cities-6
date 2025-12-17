import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../providers/StoreProvider/config/store';
import { CITY_MAP } from '../consts/consts';
import type { Point } from '../../../shared/types/map';

export const selectCityKey = (s: RootState) => s.city.currentCityKey;
export const selectSelectedPoint = (s: RootState) => s.city.selectedPoint;

export const selectCurrentCity = createSelector(
  [selectCityKey],
  (key) => CITY_MAP[key]
);

export const selectAllOffers = (s: RootState) => s.offers.items;
export const selectOffersLoading = (s: RootState) => s.offers.loading;
export const selectOffersLoaded = (s: RootState) => s.offers.loaded;
export const selectOffersError = (s: RootState) => s.offers.error;

export const selectOffersByCurrentCity = createSelector(
  [selectAllOffers, selectCurrentCity],
  (offers, city) => offers.filter((o) => o.city.name === city.title)
);

export const selectOfferPointsByCurrentCity = createSelector(
  [selectOffersByCurrentCity],
  (offers): Point[] =>
    offers.map((offer) => ({
      title: `${offer.city.name} #${offer.id}`,
      lat: offer.location.latitude,
      lng: offer.location.longitude,
    }))
);

export const selectFirstPointByCity = createSelector(
  [selectOffersByCurrentCity],
  (offers) => {
    if (!offers.length) {
      return undefined;
    }
    const o = offers[0];
    return {
      lat: o.location.latitude,
      lng: o.location.longitude,
      title: o.city.name,
    };
  }
);
