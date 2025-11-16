import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAppDispatch } from './shared/lib/hooks/redux';
import { fetchOffers } from './pages/offers/model/offersSlice';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  return <AppRouter />;
}
