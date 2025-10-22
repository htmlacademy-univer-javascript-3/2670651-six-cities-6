import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Outlet,
} from 'react-router-dom';
import { OffersPage } from '../pages/offers';
import { MainPage } from '../pages/main';
import { FavoritesPage } from '../pages/favorites';
import { LoginPage } from '../pages/login';
import { NotFoundPage } from '../pages/not-found';
import { Header } from '../shared/ui/Header/Header';
import { Footer } from '../shared/ui/Footer/Footer';
import PrivateRoute from '../shared/lib/privateRoute';
import { useEffect, useState } from 'react';
import { Offer } from '../pages/offers/model/types/offer';
import { ENDPOINTS, offersApi } from '../shared/api/client';

function RootLayout() {
  return (
    <div className="page">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function OfferRoute() {
  const { id } = useParams();
  if (!id) {
    return <NotFoundPage />;
  }
  return <OffersPage id={id} />;
}

export function AppRouter() {
  const [apiData, setApiData] = useState<Offer[]>([]);

  useEffect(() => {
    offersApi.getAllOffers()
      .then((response) => setApiData(response))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, []);
  // заглушка авторизации
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<MainPage offers={apiData} />} />
          <Route path={ENDPOINTS.LOGIN} element={<LoginPage />} />
          <Route path={ENDPOINTS.OFFER} element={<OfferRoute />} />
          <Route
            path={ENDPOINTS.FAVORITE}
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <FavoritesPage offers={apiData} />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
