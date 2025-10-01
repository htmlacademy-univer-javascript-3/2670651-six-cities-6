import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Main from './pages/ui/main';
import { offers } from './mock/offers-set-for-main';
import NotFound from './pages/ui/not-found';
import Login from './pages/ui/login';
import Favorites from './pages/ui/favorites';
import Offer from './pages/ui/offer';
import PrivateRoute from './components/shared/navigate';

export function App() {
  // TODO заглушка для isAuthenticated #todo
  const isAuthenticated = false;
  const ProductWrapper = () => {
    const { id } = useParams(); return (<Offer id={id} />);
  };
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Main rentSuggestionCounter={offers.length} />} />
        <Route path="/about" element={<Login />} />
        <Route path="/favourites" element={<Favorites />} />
        <Route path="/offer/:id" element={<ProductWrapper />} />
        <Route
          path="/favourites"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
