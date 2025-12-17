import { Link, useLocation } from 'react-router-dom';
import { ENDPOINTS } from '../../../shared/api/client';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="page page--gray page--login">
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login" style={{ maxWidth: 520 }}>
            <h1 className="login__title">404. Page not found</h1>
            <p className="login__text">
              No match for <b>{location.pathname}</b>
            </p>
            <Link className="login__submit form__submit button" to={ENDPOINTS.MAIN}>
              Back to main page
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
