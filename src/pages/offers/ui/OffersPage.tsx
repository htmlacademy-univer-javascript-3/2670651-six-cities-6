// src/pages/offers/ui/OffersPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '../../../shared/lib/formatPrice';
import PriceCard from './OffersCard';
import CommentForm from '../../../shared/ui/Comment/CommentForm';
import CommentList from '../../../shared/ui/Comment/CommentList';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import { CITY_MAP, CityKey } from '../../main/consts/consts';
import { getNearestCity } from '../../../shared/lib/map/get-nearest-city';
import type { Point } from '../../../shared/types/map';
import {
  useGetNearbyOffersQuery,
  useGetOfferByIdQuery,
} from '../../../shared/api/client';

const isAuthenticated = true;

export function OffersPage({ id }: { id: string | undefined }): JSX.Element {
  const {
    data: offer,
    isLoading: offerLoading,
    isError: offerError,
  } = useGetOfferByIdQuery(id ?? '', { skip: !id });

  const {
    data: nearbyOffers = [],
    isLoading: nearbyLoading,
    isError: nearbyError,
  } = useGetNearbyOffersQuery(id ?? '', { skip: !id });

  const currentCity = useMemo(() => {
    if (offer?.city?.name) {
      const hit = (Object.keys(CITY_MAP) as CityKey[]).find(
        (k) => CITY_MAP[k].title === offer.city.name
      );
      if (hit) {
        return CITY_MAP[hit];
      }
    }
    const def = CITY_MAP.AMSTERDAM;
    return getNearestCity(def.lat, def.lng);
  }, [offer]);

  const displayedOffers = useMemo(
    () => nearbyOffers,
    [nearbyOffers]
  );

  const nearbyPoints = useMemo<Point[]>(
    () =>
      displayedOffers.map((o) => ({
        title: o.city.name,
        lat: o.location.latitude,
        lng: o.location.longitude,
      })),
    [displayedOffers]
  );

  const offerPoint: Point = useMemo(
    () =>
      offer
        ? {
          title: offer.title,
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        }
        : {
          title: currentCity.title,
          lat: currentCity.lat,
          lng: currentCity.lng,
        },
    [offer, currentCity]
  );

  const points = useMemo<Point[]>(
    () => [offerPoint, ...nearbyPoints],
    [offerPoint, nearbyPoints]
  );

  const [selectedPoint, setSelectedPoint] = useState<Point>(offerPoint);

  useEffect(() => {
    setSelectedPoint(offerPoint);
  }, [offerPoint]);

  if (!id) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <section className="offer container">Invalid offer id</section>
        </main>
      </div>
    );
  }

  if (offerLoading) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <section className="offer container">Loading…</section>
        </main>
      </div>
    );
  }

  if (offerError || !offer) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <section className="offer container">Failed to load offer</section>
        </main>
      </div>
    );
  }

  return (
    <div className="page" id={offer.id}>
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {(offer.images ?? []).slice(0, 6).map((image) => (
                <div className="offer__image-wrapper" key={image}>
                  <img
                    className="offer__image"
                    src={image}
                    alt="Photo studio"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span
                    style={{ width: `${((offer.rating ?? 0) / 5) * 100}%` }}
                  />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating ?? 'Not rated yet'}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedroom{offer.bedrooms === 1 ? '' : 's'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adult{offer.maxAdults === 1 ? '' : 's'}
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">
                  {formatPrice(offer.price ?? 0)}
                </b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {(offer.goods ?? []).map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper user__avatar-wrapper ${
                      offer.host?.isPro ? 'offer__avatar-wrapper--pro' : ''
                    }`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host?.avatarUrl}
                      width={74}
                      height={74}
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host?.name}</span>
                  {offer.host?.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                {offer.description && (
                  <div className="offer__description">
                    <p className="offer__text">{offer.description}</p>
                  </div>
                )}
              </div>

              <CommentList id={offer.id} />

              {isAuthenticated && (
                <section style={{ marginBottom: '2rem' }}>
                  <CommentForm offerId={offer.id} />
                </section>
              )}
            </div>
          </div>

          <section className="offer__map map">
            {!nearbyLoading && !nearbyError && (
              <Map
                city={currentCity}
                points={points}
                selectedPoint={selectedPoint}
                onMarkerClick={setSelectedPoint}
              />
            )}
          </section>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <div className="near-places__list places__list">
              {nearbyOffers.map((nearbyOffer) => (
                <PriceCard key={nearbyOffer.id} {...nearbyOffer} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
