import { memo } from 'react';
import PriceCard from './OffersCard';
import { Offer } from '../model/types/offer';

type OffersComponentProps = {
  offers: Offer[];
  onOfferMouseEnter?: (offer: Offer) => void;
  onOffersMouseLeave?: () => void;
};

function OffersComponentBase({
  offers,
  onOfferMouseEnter,
  onOffersMouseLeave,
}: OffersComponentProps) {
  return (
    <div
      className="cities__places-list places__list tabs__content"
      onMouseLeave={onOffersMouseLeave}
    >
      {offers.map((offer) => (
        <PriceCard
          key={offer.id}
          {...offer}
          onMouseOver={
            onOfferMouseEnter ? () => onOfferMouseEnter(offer) : undefined
          }
        />
      ))}
    </div>
  );
}

const OffersComponent = memo(OffersComponentBase);
OffersComponent.displayName = 'OffersComponent';

export default OffersComponent;
