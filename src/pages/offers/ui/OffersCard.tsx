import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offer } from '../model/types/offer';
import { ENDPOINTS, useToggleFavoriteMutation } from '../../../shared/api/client';
import { useAppSelector } from '../../../shared/lib/hooks/redux';
import { selectIsAuthorized } from '../../../features/auth/model/selectors';

export interface PriceCardProps extends Offer {
  onMouseOver?: () => void;
  isHorizontal?: boolean;
}

function PriceCardBase({
  price,
  type,
  title,
  previewImage,
  isPremium = false,
  isFavorite = false,
  rating,
  isHorizontal = false,
  onMouseOver,
  id,
}: PriceCardProps): JSX.Element {
  const navigate = useNavigate();
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const [toggleFavorite, { isLoading: isFavoriteUpdating }] =
    useToggleFavoriteMutation();

  const handleBookmarkClick = useCallback(async () => {
    if (!isAuthorized) {
      navigate(ENDPOINTS.LOGIN);
      return;
    }

    const status: 0 | 1 = isFavorite ? 0 : 1;

    try {
      await toggleFavorite({ offerId: id, status }).unwrap();
    } catch (error) {
      const httpStatus =
        error && typeof error === 'object' && 'status' in error
          ? (error as { status?: number }).status
          : undefined;
      if (httpStatus === 401) {
        navigate(ENDPOINTS.LOGIN);
      }
    }
  }, [id, isAuthorized, isFavorite, navigate, toggleFavorite]);

  return (
    <article
      className={`near-places__card place-card d-flex ${
        isHorizontal ? 'flex-row' : 'flex-column'
      }`}
      onMouseEnter={onMouseOver}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div
        className="near-places__image-wrapper place-card__image-wrapper"
        style={{
          minWidth: isHorizontal ? '220px' : '200px',
          marginRight: isHorizontal ? '20px' : '0px',
        }}
      >
        <Link to={`/offer/${id}`}>
          <img
            className={'place-card__image'}
            src={previewImage}
            width={260}
            height={200}
            alt={title}
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div
          className="place-card__price-wrapper"
          style={{ minWidth: isHorizontal ? '300px' : '266px' }}
        >
          <Link to={`/offer/${id}`}>
            <div className="place-card__price">
              <b className="place-card__price-value">&euro;{price}</b>
              <span className="place-card__price-text">/ night</span>
            </div>
          </Link>
          <button
            className={`place-card__bookmark-button button ${
              isFavorite ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
            disabled={isFavoriteUpdating}
            onClick={() => {
              void handleBookmarkClick();
            }}
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${(rating / 5) * 100}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <Link to={`/offer/${id}`}>
          <h2 className="place-card__name">{title}</h2>
        </Link>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

const PriceCard = memo(PriceCardBase);
PriceCard.displayName = 'PriceCard';

export default PriceCard;
