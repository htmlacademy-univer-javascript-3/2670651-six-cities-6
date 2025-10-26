import { Link, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../api/client';

export function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}): JSX.Element {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              to="/"
              className="header__logo-link header__logo-link--active"
            >
              <img
                className="header__logo"
                src="/img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>

          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item user">
                {!isAuthenticated && (
                  <Link
                    to={ENDPOINTS.LOGIN}
                    className="header__nav-link header__nav-link--profile"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span
                      className="header__user-name user__name"
                      onClick={() => navigate('/login')}
                    >
                      Sign in
                    </span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
