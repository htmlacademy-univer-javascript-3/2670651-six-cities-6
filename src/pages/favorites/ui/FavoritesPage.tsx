import { useMemo } from 'react';
import PriceCard from '../../offers/ui/OffersCard';
import type { Offer } from '../../offers/model/types/offer';
import { useGetFavoriteOffersQuery } from '../../../shared/api/client';

type GroupedFavorites = Record<string, Offer[]>;

export function FavoritesPage(): JSX.Element {
  const {
    data: favoriteOffers = [],
    isLoading,
    isError,
  } = useGetFavoriteOffersQuery();

  const groupedFavorites: GroupedFavorites = useMemo(
    () =>
      favoriteOffers.reduce<GroupedFavorites>((acc, offer) => {
        const cityName = offer.city.name;
        if (!acc[cityName]) {
          acc[cityName] = [];
        }
        acc[cityName].push(offer);
        return acc;
      }, {}),
    [favoriteOffers]
  );

  if (isLoading) {
    return (
      <div className="page">
        <main className="page__main page__main--favorites">
          <section className="favorites container">Loading favorites…</section>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <main className="page__main page__main--favorites">
          <section className="favorites container">
            Failed to load favorites
          </section>
        </main>
      </div>
    );
  }

  if (!favoriteOffers.length) {
    return (
      <div className="page page--favorites-empty">
        <main className="page__main page__main--favorites page__main--favorites-empty">
          <section className="favorites favorites--empty">
            <h1 className="visually-hidden">Favorites (empty)</h1>
            <div className="favorites__status-wrapper">
              <b className="favorites__status">Nothing yet saved.</b>
              <p className="favorites__status-description">
                Save properties to narrow down search or plan your future trips.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {Object.entries(groupedFavorites)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([cityName, offers]) => (
                  <li className="favorites__locations-items" key={cityName}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a
                          className="locations__item-link"
                          href={`#${cityName}`}
                        >
                          <span>{cityName}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {offers.map((offer) => (
                        <PriceCard isHorizontal key={offer.id} {...offer} />
                      ))}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
