// src/pages/offers/ui/OffersPage.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../shared/lib/formatPrice';
import PriceCard from './OffersCard';
import CommentForm from '../../../shared/ui/Comment/CommentForm';
import CommentList from '../../../shared/ui/Comment/CommentList';
import Map from '../../../shared/ui/LeafletMap/ui/LeafletMap';
import { CITY_MAP, CityKey } from '../../main/consts/consts';
import { getNearestCity } from '../../../shared/lib/map/get-nearest-city';
import type { Point } from '../../../shared/types/map';
import {
  ENDPOINTS,
  useGetNearbyOffersQuery,
  useGetOfferByIdQuery,
  useToggleFavoriteMutation,
} from '../../../shared/api/client';
import { useAppSelector } from '../../../shared/lib/hooks/redux';
import { selectAuthorizationStatus } from '../../../features/auth/model/selectors';
import { AuthorizationStatus } from '../../../shared/types/auth';

export function OffersPage({ id }: { id: string | undefined }): JSX.Element {
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuthenticated = authorizationStatus === AuthorizationStatus.Authorized;
  const {
    data: offer,
    isLoading: offerLoading,
    isError: offerError,
    error: offerQueryError,
  } = useGetOfferByIdQuery(id ?? '', { skip: !id });

  const {
    data: nearbyOffers = [],
    isLoading: nearbyLoading,
    isError: nearbyError,
  } = useGetNearbyOffersQuery(id ?? '', { skip: !id });

  const [toggleFavorite, { isLoading: isFavoriteUpdating }] =
    useToggleFavoriteMutation();

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

  const offerId = offer?.id ?? '';
  const offerIsFavorite = offer?.isFavorite ?? false;

  const handleOfferBookmarkClick = useCallback(async () => {
    if (!isAuthenticated) {
      navigate(ENDPOINTS.LOGIN);
      return;
    }
    if (!offerId) {
      return;
    }

    const status: 0 | 1 = offerIsFavorite ? 0 : 1;

    try {
      await toggleFavorite({ offerId, status }).unwrap();
    } catch (error) {
      const httpStatus =
        error && typeof error === 'object' && 'status' in error
          ? (error as { status?: number }).status
          : undefined;
      if (httpStatus === 401) {
        navigate(ENDPOINTS.LOGIN);
      }
    }
  }, [isAuthenticated, navigate, offerId, offerIsFavorite, toggleFavorite]);

  if (!id) {
    return <Navigate to={ENDPOINTS.NOT_FOUND} replace />;
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

  if (offerError) {
    const status =
      offerQueryError &&
      typeof offerQueryError === 'object' &&
      'status' in offerQueryError
        ? (offerQueryError as { status?: number }).status
        : undefined;

    if (status === 404) {
      return <Navigate to={ENDPOINTS.NOT_FOUND} replace />;
    }

    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <section className="offer container">Failed to load offer</section>
        </main>
      </div>
    );
  }

  if (!offer) {
    return <Navigate to={ENDPOINTS.NOT_FOUND} replace />;
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
                <button
                  className={`offer__bookmark-button button ${
                    offerIsFavorite ? 'offer__bookmark-button--active' : ''
                  }`}
                  type="button"
                  disabled={isFavoriteUpdating}
                  onClick={() => {
                    void handleOfferBookmarkClick();
                  }}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {offerIsFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
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

              <CommentList id={offer.id}>
                {isAuthenticated ? <CommentForm offerId={offer.id} /> : null}
              </CommentList>
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
