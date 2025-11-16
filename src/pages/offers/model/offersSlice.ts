import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { offersApi } from '../../../shared/api/client';
import { Offer } from './types/offer';

type OffersState = {
  items: Offer[];
  loading: boolean;
  error: string | null;
};

const initialState: OffersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOffers = createAsyncThunk('offers/fetchAll', async () => {
  const res = await offersApi.getAllOffers();
  return res;
});

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOffers.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchOffers.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchOffers.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed';
    });
  },
});

export const { reducer: offersReducer } = offersSlice;
