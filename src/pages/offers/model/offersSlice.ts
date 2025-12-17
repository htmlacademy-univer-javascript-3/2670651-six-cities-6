import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import { ENDPOINTS, offersApi } from '../../../shared/api/client';
import { Offer } from './types/offer';

type OffersState = {
  items: Offer[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: OffersState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  void,
  { extra: AxiosInstance; rejectValue: string }
>('offers/fetchAll', async (_arg, { extra: api, rejectWithValue }) => {
  try {
    const response = await api.get<Offer[]>(ENDPOINTS.OFFERS);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to load offers');
  }
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
      s.loaded = true;
      s.items = a.payload;
    });
    b.addCase(fetchOffers.rejected, (s, a) => {
      s.loading = false;
      s.loaded = true;
      s.error = a.payload ?? a.error.message ?? 'Failed';
    });

    b.addMatcher(
      offersApi.endpoints.toggleFavorite.matchFulfilled,
      (state, action) => {
        const updatedOffer = action.payload;
        const storedOffer = state.items.find((o) => o.id === updatedOffer.id);
        if (storedOffer) {
          storedOffer.isFavorite = updatedOffer.isFavorite;
        }
      }
    );
  },
});

export const { reducer: offersReducer } = offersSlice;
