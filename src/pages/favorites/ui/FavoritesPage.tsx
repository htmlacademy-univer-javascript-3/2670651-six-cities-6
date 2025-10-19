import { useEffect, useState } from 'react';

import PriceCard from '../../offers/ui/OffersCard';
import { Offer } from '../../offers/model/types/offer';
interface FavoritesPageProps {
  offers: Offer[];
}

export function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

  useEffect(() => {
    if (currentOffer) {
      // eslint-disable-next-line no-console
      console.log(currentOffer);
    }
  }, [currentOffer]);
  return (
    <div className="page">
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              <li className="favorites__locations-items w-full">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Amsterdam</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {offers.filter(
                    (offer) => offer?.city?.name === 'Amsterdam'
                    // && offer.isFavorite
                  ).length &&
                    offers
                      .slice(0, 3)
                      .map((offer) => (
                        <PriceCard
                          isHorizontal
                          key={offer.id}
                          {...offer}
                          onMouseOver={() => setCurrentOffer(offer)}
                        />
                      ))}
                </div>
              </li>

              <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Cologne</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places ">
                  {offers.filter(
                    (offer) => offer?.city?.name === 'Cologne'
                    // && offer.isFavorite
                  ).length &&
                    offers
                      .slice(0, 3)
                      .map((offer) => (
                        <PriceCard isHorizontal {...offer} key={offer.id} />
                      ))}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
