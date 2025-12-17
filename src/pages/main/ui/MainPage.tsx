// src/pages/main/ui/MainPage.tsx

import { useCallback, useEffect } from 'react';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import OffersComponent from '../../offers/ui/OffersComponent';
import type { Point } from '../../../shared/types/map';
import CitiesList from './CitiesList';
import Spinner from '../../../shared/ui/Spinner/Spinner';
import MainPageEmpty from './MainPageEmpty';

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

                    <form className="places__sorting" action="#" method="get">
                      <span className="places__sorting-caption">Sort by</span>
                      <span className="places__sorting-type" tabIndex={0}>
                        Popular
                        <svg
                          className="places__sorting-arrow"
                          width="7"
                          height="4"
                        >
                          <use xlinkHref="#icon-arrow-select"></use>
                        </svg>
                      </span>
                      <ul className="places__options places__options--custom places__options--opened">
                        <li
                          className="places__option places__option--active"
                          tabIndex={0}
                        >
                          Popular
                        </li>
                        <li className="places__option" tabIndex={0}>
                          Price: low to high
                        </li>
                        <li className="places__option" tabIndex={0}>
                          Price: high to low
                        </li>
                        <li className="places__option" tabIndex={0}>
                          Top rated first
                        </li>
                      </ul>
                    </form>

                    <OffersComponent
                      offers={offersByCity}
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
