import axios, { AxiosResponse } from 'axios';
import { Offer } from '../../pages/offers/model/types/offer';
import { OfferPage } from '../../pages/offers/model/types/offers-page';
import { CommentDTO, Review } from '../../pages/offers/model/types/comments';

export const API_CONFIG = {
  BASE_URL: 'https://14.design.htmlacademy.pro/six-cities',
  TIMEOUT: 5000,
} as const;

export enum ENDPOINTS {
  MAIN = '/',
  OFFERS = '/offers',
  OFFER = '/offer/:id',
  FAVORITE = '/favorites',
  LOGIN = '/login',
  LOGOUT = '/logout',
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-Token':
      localStorage.getItem('x-token') || 'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20=',
    'Content-Type': 'application/json',
  },
});

export const offersApi = {
  getAllOffers: (): Promise<Offer[]> =>
    apiClient.get<Offer[]>('/offers').then((response) => response.data),

  getOfferById: (id: string): Promise<OfferPage> =>
    apiClient.get<OfferPage>(`/offers/${id}`).then((response) => response.data),

  getNearbyOffers: (id: string): Promise<Offer[]> =>
    apiClient
      .get<Offer[]>(`/offers/${id}/nearby`)
      .then((response) => response.data),
};

export const commentsApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postNewComment: (data: CommentDTO, offerId: string): Promise<AxiosResponse<CommentDTO, any>> =>
    apiClient.post<CommentDTO>(`/comments/${offerId}`, {
      data,
    }),

  getCommentById: (id: string): Promise<Review[]> =>
    apiClient.get<Review[]>(`/comment/${id}`).then((response) => response.data),
};

export { apiClient };
