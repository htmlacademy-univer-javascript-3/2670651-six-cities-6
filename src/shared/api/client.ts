// src/shared/api/client.ts
import axios from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';

import type { Offer } from '../../pages/offers/model/types/offer';
import type { CommentDTO, Review } from '../types/comments';
import { OfferPage } from '../../pages/offers/model/types/offers-page';

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

// 1) ЕДИНСТВЕННЫЙ axios-клиент
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'X-Token':
      localStorage.getItem('x-token') || 'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20=',
    'Content-Type': 'application/json',
  },
});

// 2) Базовый адаптер под RTK Query (axios)
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: unknown;
      params?: unknown;
    },
    unknown,
    { status?: number; data?: unknown } | string
  > =>
    async ({ url, method = 'get', data, params }) => {
      try {
        const result = await apiClient({ url, method, data, params });
        return { data: result.data };
      } catch (e) {
        const err = e as AxiosError;
        return {
          error:
            (err.response && {
              status: err.response.status,
              data: err.response.data,
            }) ||
            err.message,
        };
      }
    };

// 3) OFFERS API на RTK Query (использует axiosBaseQuery)
export const offersApi = createApi({
  reducerPath: 'offersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Offers'],
  endpoints: (builder) => ({
    getAllOffers: builder.query<Offer[], void>({
      query: () => ({ url: '/offers', method: 'get' }),
      providesTags: ['Offers'],
    }),
    getOfferById: builder.query<OfferPage, string>({
      query: (id) => ({ url: `/offers/${id}`, method: 'get' }),
    }),
    getNearbyOffers: builder.query<Offer[], string>({
      query: (id) => ({ url: `/offers/${id}/nearby`, method: 'get' }),
    }),
  }),
});

export const {
  useGetAllOffersQuery,
  useGetOfferByIdQuery,
  useGetNearbyOffersQuery,
} = offersApi;

// 4) COMMENTS API на RTK Query (тот же базовый адаптер)
export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    // сервер у тебя слушает GET /comment/:id (оставляю как есть)
    getCommentsByOfferId: builder.query<Review[], string>({
      query: (id) => ({ url: `/comment/${id}`, method: 'get' }),
      providesTags: (_, __, id) => [{ type: 'Comments', id }],
    }),
    // POST /comments/:offerId c payload { data: ... }
    postNewComment: builder.mutation<CommentDTO,{ offerId: string; data: CommentDTO }>({
      query: ({ offerId, data }) => ({
        url: `/comments/${offerId}`,
        method: 'post',
        data: { data },
      }),
      invalidatesTags: (_, __, { offerId }) => [
        { type: 'Comments', id: offerId },
      ],
    }),
  }),
});

export const { useGetCommentsByOfferIdQuery, usePostNewCommentMutation } =
  commentsApi;
