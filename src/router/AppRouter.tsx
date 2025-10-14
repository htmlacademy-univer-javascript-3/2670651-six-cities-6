import { BrowserRouter, Routes, Route, useParams, Outlet } from 'react-router-dom';
import { OffersPage } from '../pages/offers';
import { MainPage } from '../pages/main';
import { FavoritesPage } from '../pages/favorites';
import { LoginPage } from '../pages/login';
import { NotFoundPage } from '../pages/not-found';
import { Header } from '../shared/ui/Header/Header';
import { Footer } from '../shared/ui/Footer/Footer';
import PrivateRoute from '../shared/lib/privateRoute';


function RootLayout() {
  return (
    <div className="page">
      <Header />
      <Outlet />
      <Footer/>
    </div>
  );
}

// обёртка для /offer/:id
function OfferRoute() {
  const { id } = useParams();
  return <OffersPage id={id} />;
}

export function AppRouter() {
  // заглушка авторизации, потом заменишь на реальную
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<MainPage rentSuggestionCounter={0} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/offer/:id" element={<OfferRoute />} />
          <Route
            path="/favourites"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
