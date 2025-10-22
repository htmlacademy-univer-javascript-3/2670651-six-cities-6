import { useEffect, useState } from 'react';
import { OfferPage } from '../model/types/offers-page';
import { commentsApi, offersApi } from '../../../shared/api/client';
import { formatPrice } from '../../../shared/lib/formatPrice';
import { Offer } from '../model/types/offer';
import PriceCard from './OffersCard';
import { Review } from '../model/types/comments';
import { isAxiosError } from 'axios';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

export function OffersPage({ id }: { id: string | undefined }): JSX.Element {
  const [offer, setOffer] = useState<OfferPage | null>(null);
  const [nearbyOffers, setNearbyOffers] = useState<Offer[] | null>(null);
  const [comments, setComments] = useState<Review[] | null>(null);

  useEffect(() => {
    offersApi
      .getOfferById(id || '')
      .then((response) => setOffer(response))
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));

    offersApi
      .getNearbyOffers(id || '')
      .then((response) => setNearbyOffers(response))
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));

    commentsApi
      .getCommentById(id || '')
      .then((response) => setComments(response))
      // eslint-disable-next-line no-console
      .catch((error) => {
        if (isAxiosError(error) && error?.response?.status === 404) {
          setComments([]);
        } else {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      });
  }, [id]);

  return (
    <div className="page" id={offer?.id}>
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {Object.keys(offer?.images || {}).length > 0 &&
                offer?.images?.slice(0, 6).map((image) => (
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
              {offer?.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer?.title}</h1>
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
                    style={{ width: `${((offer?.rating ?? 0) / 5) * 100}%` }}
                  />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer?.rating ?? 'Did not calculated rating yet'}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer?.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer?.bedrooms}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {offer?.maxAdults}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">
                  {formatPrice(offer?.price ?? 0)}
                </b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer?.goods?.length &&
                    offer?.goods.map((good) => (
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
                      offer?.host?.isPro ? 'offer__avatar-wrapper--pro' : ''
                    }`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={offer?.host?.avatarUrl}
                      width={74}
                      height={74}
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer?.host?.name}</span>
                  {offer?.host?.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  {offer?.description && (
                    <p className="offer__text">{offer?.description}</p>
                  )}
                </div>
              </div>
              {!!comments?.length && (
                <section className="offer__reviews reviews">
                  <h2 className="reviews__title">
                    Reviews &middot;{' '}
                    <span className="reviews__amount">{comments.length}</span>
                  </h2>
                  <ul className="reviews__list">
                    {comments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <CommentForm />
              </section>
            </div>
          </div>
          <section className="offer__map map"></section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <div className="near-places__list places__list">
              {nearbyOffers?.length &&
                nearbyOffers
                  ?.slice(0, 3)
                  .map((nearbyOffer) => (
                    <PriceCard key={nearbyOffer?.id} {...nearbyOffer} />
                  ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
