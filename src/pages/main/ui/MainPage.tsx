// src/pages/main/ui/MainPage.tsx

import { useMemo } from 'react';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import OffersComponent from '../../offers/ui/OffersComponent';
import type { Point } from '../../../shared/types/map';
import CitiesList from './CitiesList';
import Spinner from '../../../shared/ui/Spinner/Spinner';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../shared/lib/hooks/redux';

import {
  selectCurrentCity,
  selectOffersByCurrentCity,
  selectOffersError,
  selectOffersLoading,
  selectSelectedPoint,
} from '../model/selectors';
import { cityActions } from '../model/citySlice';

export function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentCity = useAppSelector(selectCurrentCity);
  const selectedPointFromState = useAppSelector(selectSelectedPoint);
  const offersByCity = useAppSelector(selectOffersByCurrentCity);
  const isLoading = useAppSelector(selectOffersLoading);
  const offersError = useAppSelector(selectOffersError);

  const autoPoint: Point | undefined = useMemo(() => {
    const o = offersByCity[0];
    return o
      ? {
        lat: o.location.latitude,
        lng: o.location.longitude,
        title: o.city.name,
      }
      : undefined;
  }, [offersByCity]);

  const selectedPoint = selectedPointFromState ?? autoPoint;

  const points = useMemo(
    () =>
      offersByCity.map((o) => ({
        title: `${o.city.name} #${o.id}`,
        lat: o.location.latitude,
        lng: o.location.longitude,
      })),
    [offersByCity]
  );

  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <section className="locations container">
            <CitiesList />
          </section>
        </div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>

              {isLoading && <Spinner />}

              {!isLoading && offersError && (
                <p className="cities__status">{offersError}</p>
              )}

              {!isLoading && !offersError && (
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

                  <OffersComponent offers={offersByCity} />
                </>
              )}
            </section>

            <div className="cities__right-section">
              <section className="cities__map ">
                <div id="map">
                  <Map
                    city={currentCity}
                    points={points}
                    selectedPoint={selectedPoint}
                    onMarkerClick={(point) => {
                      dispatch(cityActions.setSelectedPoint(point));
                    }}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
