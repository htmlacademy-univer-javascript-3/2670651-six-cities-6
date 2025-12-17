// /src/router/AppRouter.tsx

import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { OffersPage } from '../pages/offers';
import { MainPage } from '../pages/main';
import { FavoritesPage } from '../pages/favorites';
import { LoginPage } from '../pages/login';
import { NotFoundPage } from '../pages/not-found';
import { Header } from '../shared/ui/Header/Header';
import { Footer } from '../shared/ui/Footer/Footer';
import PrivateRoute from '../shared/lib/privateRoute';

import { ENDPOINTS } from '../shared/api/client';

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
    return <Navigate to={ENDPOINTS.NOT_FOUND} replace />;
  }
  return <OffersPage id={id} />;
}

export function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<MainPage />} />
          <Route path={ENDPOINTS.LOGIN} element={<LoginPage />} />
          <Route path={ENDPOINTS.OFFER} element={<OfferRoute />} />
          <Route path={ENDPOINTS.NOT_FOUND} element={<NotFoundPage />} />
          <Route
            path={ENDPOINTS.FAVORITE}
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={ENDPOINTS.NOT_FOUND} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
