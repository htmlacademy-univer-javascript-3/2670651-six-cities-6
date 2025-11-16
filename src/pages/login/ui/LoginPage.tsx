import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks/redux';
import { login } from '../../../features/auth/model/authSlice';
import { AuthorizationStatus } from '../../../shared/types/auth';
import {
  selectAuthorizationStatus,
  selectAuthError,
} from '../../../features/auth/model/selectors';
import { CITY_KEYS, CITY_MAP, CityKey } from '../../main/consts/consts';
import { cityActions } from '../../main/model/citySlice';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const authError = useAppSelector(selectAuthError);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState<string | null>(null);
  const randomCityKey = useMemo<CityKey>(
    () => CITY_KEYS[Math.floor(Math.random() * CITY_KEYS.length)],
    []
  );
  const randomCity = CITY_MAP[randomCityKey];

  const isSubmitDisabled =
    !formData.email ||
    !formData.password ||
    !PASSWORD_PATTERN.test(formData.password);

  if (authorizationStatus === AuthorizationStatus.Authorized) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!PASSWORD_PATTERN.test(formData.password)) {
      setLocalError('Password must contain at least one letter and one number');
      return;
    }
    setLocalError(null);

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (error) {
      const message =
        typeof error === 'string' ? error : 'Failed to sign in. Try again.';
      setLocalError(message);
    }
  };

  const handleRandomCityClick = () => {
    dispatch(cityActions.setCityKey(randomCityKey));
    navigate('/');
  };

  return (
    <div className="page page--gray page--login">
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              method="post"
              onSubmit={(event) => {
                void submitForm(event);
              }}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="email">
                  E-mail
                </label>
                <input
                  className="login__input form__input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden" htmlFor="password">
                  Password
                </label>
                <input
                  className="login__input form__input"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {(localError || authError) && (
                <p className="form__error">{localError || authError}</p>
              )}
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isSubmitDisabled}
              >
                Sign in
              </button>
            </form>
          </section>

          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <button
                className="locations__item-link"
                type="button"
                onClick={handleRandomCityClick}
              >
                <span>{randomCity.title}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
