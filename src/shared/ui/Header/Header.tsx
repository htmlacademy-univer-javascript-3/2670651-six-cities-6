import { Link, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../api/client';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/redux';
import {
  selectAuthorizationStatus,
  selectAuthUser,
} from '../../../features/auth/model/selectors';
import { AuthorizationStatus } from '../../types/auth';
import { logout } from '../../../features/auth/model/authSlice';
import { useGetFavoriteOffersQuery } from '../../api/client';

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectAuthUser);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Authorized;
  const { data: favoriteOffers = [] } = useGetFavoriteOffersQuery(undefined, {
    skip: !isAuthorized,
  });

  const handleLogout = () => {
    void dispatch(logout());
  };

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
              {!isAuthorized && (
                <li className="header__nav-item user">
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
                </li>
              )}

              {isAuthorized && (
                <>
                  <li className="header__nav-item user">
                    <Link
                      to={ENDPOINTS.FAVORITE}
                      className="header__nav-link header__nav-link--profile"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            style={{
                              width: '40px',

                              borderRadius: '50%',
                            }}
                          />
                        ) : null}
                      </div>
                      <span className="header__user-name user__name">
                        {user?.email}
                      </span>
                      <span className="header__favorite-count">
                        {favoriteOffers.length}
                      </span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <button
                      className="header__nav-link header__nav-link--profile button"
                      type="button"
                      onClick={handleLogout}
                    >
                      <span className="header__signout">Sign out</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
