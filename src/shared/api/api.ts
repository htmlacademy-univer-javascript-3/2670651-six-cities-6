import axios, { type AxiosInstance } from 'axios';

export const API_BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const API_TIMEOUT = 5000;
export const TOKEN_STORAGE_KEY = 'six-cities-token';

export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const token =
    (typeof window !== 'undefined' &&
      window.localStorage.getItem(TOKEN_STORAGE_KEY)) ||
    'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20=';

  instance.defaults.headers.common['X-Token'] = token;

  return instance;
};

export const apiClient = createApiClient();
