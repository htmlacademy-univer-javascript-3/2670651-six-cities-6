import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAppDispatch } from './shared/lib/hooks/redux';
import { fetchOffers } from './pages/offers/model/offersSlice';
import { checkAuth } from './features/auth/model/authSlice';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchOffers());
  }, [dispatch]);

  return <AppRouter />;
}
