import { useEffect, useMemo, useState } from 'react';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import { Offer } from '../../offers/model/types/offer';
import OffersComponent from '../../offers/ui/OffersComponent';
import type { CityKey, Point } from '../../../shared/types/map';
import { CITY_KEYS, CITY_MAP } from '../consts/consts';
import { offersApi } from '../../../shared/api/client';

export function MainPage(): JSX.Element {
  const [currentCityKey, setCurrentCityKey] = useState<CityKey>('AMSTERDAM');
  const [currentCity, setCurrentCity] = useState(CITY_MAP[currentCityKey]);
  const [selectedPoint, setSelectedPoint] = useState<Point | undefined>(
    undefined
  );
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [apiData, setApiData] = useState<Offer[]>([]);
  useEffect(() => {
    offersApi
      .getAllOffers()
      .then((response) => setAllOffers(response))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setCurrentCity(CITY_MAP[currentCityKey]);
  }, [currentCityKey]);

  useEffect(() => {
    const filtered = allOffers.filter(
      (o) => o.city.name === CITY_MAP[currentCityKey].title
    );
    setApiData(filtered);
    if (filtered.length > 0) {
      setSelectedPoint({
        lat: filtered[0].location.latitude,
        lng: filtered[0].location.longitude,
        title: filtered[0].city.name,
      });
    } else {
      setSelectedPoint(undefined);
    }
  }, [allOffers, currentCityKey]);

  const points = useMemo(
    () =>
      apiData.map((o) => ({
        title: `${o.city.name} #${o.id}`,
        lat: o.location.latitude,
        lng: o.location.longitude,
      })),
    [apiData]
  );

  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {CITY_KEYS.map((key) => (
                <li className="locations__item" key={key}>
                  <a
                    className={`locations__item-link tabs__item ${
                      key === currentCityKey ? 'tabs__item--active' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentCityKey(key);
                    }}
                    href={`#${key}`}
                  >
                    <span>{CITY_MAP[key].title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {apiData.length} place{apiData.length > 1 ? 's' : ''} to stay in{' '}
                {currentCity.title}
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
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
              <OffersComponent offers={apiData} />
            </section>
            <div className="cities__right-section">
              <section className="cities__map ">
                <div id="map">
                  <Map
                    city={currentCity}
                    points={points}
                    selectedPoint={selectedPoint}
                    onMarkerClick={setSelectedPoint}
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
