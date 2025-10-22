import { Link } from 'react-router-dom';
import { Offer } from '../model/types/offer';

export interface PriceCardProps extends Offer {
  onMouseOver?: () => void;
  isHorizontal?: boolean;
}

export default function PriceCard({
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
  return (
    <article
      className={`near-places__card place-card d-flex ${
        isHorizontal ? 'flex-row' : 'flex-column'
      }`}
      onMouseOver={onMouseOver}
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
