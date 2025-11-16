import axios, { AxiosError, isAxiosError, type AxiosInstance } from 'axios';

export const API_BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
export const API_TIMEOUT = 5000;
export const TOKEN_STORAGE_KEY = 'six-cities-token';

const getStorage = (): Storage | undefined =>
  typeof window !== 'undefined' ? window.localStorage : undefined;

const getInitialToken = (): string | null => {
  const storageToken = getStorage()?.getItem(TOKEN_STORAGE_KEY);
  if (storageToken) {
    return storageToken;
  }
  return (import.meta.env.VITE_AUTH_TOKEN as string) ?? null;
};

const buildApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const initialToken = getInitialToken();
  if (initialToken) {
    instance.defaults.headers.common['X-Token'] = initialToken;
  }

  return instance;
};

export const apiClient = buildApiClient();

export const saveToken = (token: string): void => {
  getStorage()?.setItem(TOKEN_STORAGE_KEY, token);
  apiClient.defaults.headers.common['X-Token'] = token;
};

export const dropToken = (): void => {
  getStorage()?.removeItem(TOKEN_STORAGE_KEY);
  delete apiClient.defaults.headers.common['X-Token'];
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: Error | AxiosError) => {

    if (isAxiosError(error) && error.response?.status === 401 || error?.message.includes('401')) {
      dropToken();
    }
    return Promise.reject(error);
  }
);
