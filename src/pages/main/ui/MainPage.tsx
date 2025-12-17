// src/pages/main/ui/MainPage.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import OffersComponent from '../../offers/ui/OffersComponent';
import type { Point } from '../../../shared/types/map';
import CitiesList from './CitiesList';
import Spinner from '../../../shared/ui/Spinner/Spinner';
import MainPageEmpty from './MainPageEmpty';
import SortOptions from './SortOptions';
import { SortType } from '../consts/sort';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../shared/lib/hooks/redux';

import {
  selectCurrentCity,
  selectOfferPointsByCurrentCity,
  selectOffersByCurrentCity,
  selectOffersError,
  selectOffersLoaded,
  selectOffersLoading,
  selectSelectedPoint,
} from '../model/selectors';
import { cityActions } from '../model/citySlice';
import { fetchOffers } from '../../offers/model/offersSlice';
import type { Offer } from '../../offers/model/types/offer';

export function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentCity = useAppSelector(selectCurrentCity);
  const selectedPointFromState = useAppSelector(selectSelectedPoint);
  const offersByCity = useAppSelector(selectOffersByCurrentCity);
  const points = useAppSelector(selectOfferPointsByCurrentCity);
  const isLoading = useAppSelector(selectOffersLoading);
  const isLoaded = useAppSelector(selectOffersLoaded);
  const offersError = useAppSelector(selectOffersError);
  const [sortType, setSortType] = useState<SortType>(SortType.Popular);

  useEffect(() => {
    if (!isLoaded && !isLoading && !offersError) {
      dispatch(fetchOffers());
    }
  }, [dispatch, isLoaded, isLoading, offersError]);

  const isEmpty =
    isLoaded && !isLoading && !offersError && offersByCity.length === 0;

  const handleOfferMouseEnter = useCallback(
    (offer: Offer) => {
      dispatch(
        cityActions.setSelectedPoint({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
          title: `${offer.city.name} #${offer.id}`,
        })
      );
    },
    [dispatch]
  );

  const handleOffersMouseLeave = useCallback(() => {
    dispatch(cityActions.setSelectedPoint(undefined));
  }, [dispatch]);

  const handleMarkerClick = useCallback(
    (point: Point) => {
      dispatch(cityActions.setSelectedPoint(point));
    },
    [dispatch]
  );

  const sortedOffers = useMemo(() => {
    switch (sortType) {
      case SortType.PriceLowHigh:
        return [...offersByCity].sort((a, b) => a.price - b.price);
      case SortType.PriceHighLow:
        return [...offersByCity].sort((a, b) => b.price - a.price);
      case SortType.TopRated:
        return [...offersByCity].sort((a, b) => b.rating - a.rating);
      default:
        return offersByCity;
    }
  }, [offersByCity, sortType]);

  return (
    <div className="page page--gray page--main">
      <main
        className={`page__main page__main--index${
          isEmpty ? ' page__main--index-empty' : ''
        }`}
      >
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <section className="locations container">
            <CitiesList />
          </section>
        </div>

        <div className="cities">
          {isEmpty ? (
            <MainPageEmpty cityName={currentCity.title} />
          ) : (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>

                {(isLoading || !isLoaded) && <Spinner />}

                {!isLoading && isLoaded && offersError && (
                  <p className="cities__status">{offersError}</p>
                )}

                {!isLoading && isLoaded && !offersError && (
                  <>
                    <b className="places__found">
                      {`${offersByCity.length} place${
                        offersByCity.length > 1 ? 's' : ''
                      } to stay in ${currentCity.title}`}
                    </b>

                    <SortOptions
                      active={sortType}
                      onChange={setSortType}
                    />

                    <OffersComponent
                      offers={sortedOffers}
                      onOfferMouseEnter={handleOfferMouseEnter}
                      onOffersMouseLeave={handleOffersMouseLeave}
                    />
                  </>
                )}
              </section>

              <div className="cities__right-section">
                <section className="cities__map ">
                  <div id="map">
                    <Map
                      city={currentCity}
                      points={points}
                      selectedPoint={selectedPointFromState}
                      onMarkerClick={handleMarkerClick}
                    />
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
