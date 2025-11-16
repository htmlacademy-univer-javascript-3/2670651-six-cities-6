// src/shared/api/client.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';

import type { Offer } from '../../pages/offers/model/types/offer';
import type { CommentDTO, Review } from '../types/comments';
import { OfferPage } from '../../pages/offers/model/types/offers-page';
import { apiClient } from './api';

export enum ENDPOINTS {
  MAIN = '/',
  OFFERS = '/offers',
  OFFER = '/offer/:id',
  FAVORITE = '/favorites',
  LOGIN = '/login',
  LOGOUT = '/logout',
}


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


export const offersApi = createApi({
  reducerPath: 'offersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Offers'],
  endpoints: (builder) => ({
    getOfferById: builder.query<OfferPage, string>({
      query: (id) => ({ url: `/offers/${id}`, method: 'get' }),
    }),
    getNearbyOffers: builder.query<Offer[], string>({
      query: (id) => ({ url: `/offers/${id}/nearby`, method: 'get' }),
    }),
    getFavoriteOffers: builder.query<Offer[], void>({
      query: () => ({ url: '/favorite', method: 'get' }),
      providesTags: ['Offers'],
    }),
    toggleFavorite: builder.mutation<
      Offer,
      { offerId: string; status: 0 | 1 }
    >({
      query: ({ offerId, status }) => ({
        url: `/favorite/${offerId}/${status}`,
        method: 'post',
      }),
      invalidatesTags: ['Offers'],
    }),
  }),
});

export const {
  useGetOfferByIdQuery,
  useGetNearbyOffersQuery,
  useGetFavoriteOffersQuery,
  useToggleFavoriteMutation,
} = offersApi;

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getCommentsByOfferId: builder.query<Review[], string>({
      query: (id) => ({ url: `/comments/${id}`, method: 'get' }),
      providesTags: (_, __, id) => [{ type: 'Comments', id }],
    }),
    postNewComment: builder.mutation<
      Review,
      { offerId: string; data: CommentDTO }
    >({
      query: ({ offerId, data }) => ({
        url: `/comments/${offerId}`,
        method: 'post',
        data: {
          comment: data.comment,
          rating: data.rating,
        },
      }),
      invalidatesTags: (_, __, { offerId }) => [
        { type: 'Comments', id: offerId },
      ],
    }),
  }),
});

export const { useGetCommentsByOfferIdQuery, usePostNewCommentMutation } =
  commentsApi;
