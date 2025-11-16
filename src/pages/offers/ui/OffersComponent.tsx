import { useEffect, useState } from 'react';
import PriceCard from './OffersCard';
import { Offer } from '../model/types/offer';


export default function OffersComponent({ offers }: { offers: Offer[] }) {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  useEffect(() => {
    if (currentOffer) {
      // // eslint-disable-next-line no-alert
      // alert(`Current offer: ${currentOffer.title}`);

    }
  }, [currentOffer]);
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PriceCard key={offer.id} { ...offer} onMouseOver={() => setCurrentOffer(offer)} />
      ))}
    </div>
  );
}
