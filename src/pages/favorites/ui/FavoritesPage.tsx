import { useEffect, useState } from 'react';

import PriceCard from '../../offers/ui/OffersCard';
import { Offer } from '../../offers/model/types/offer';
import { offersApi } from '../../../shared/api/client';

export function FavoritesPage(): JSX.Element {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [apiData, setApiData] = useState<Offer[]>([]);

  useEffect(() => {
    offersApi
      .getAllOffers()
      .then((response) => setApiData(response))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, []);
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
                  {apiData.filter(
                    (offer) => offer?.city?.name === 'Amsterdam'
                    // && offer.isFavorite
                  ).length &&
                    apiData
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
                  {apiData.filter(
                    (offer) => offer?.city?.name === 'Cologne'
                    // && offer.isFavorite
                  ).length &&
                    apiData
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
