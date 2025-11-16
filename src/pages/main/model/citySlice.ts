import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CityKey, Point } from '../../../shared/types/map';

type CityState = {
  currentCityKey: CityKey;
  selectedPoint?: Point;
};

const initialState: CityState = {
  currentCityKey: 'AMSTERDAM',
  selectedPoint: undefined,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCityKey(state, action: PayloadAction<CityKey>) {
      state.currentCityKey = action.payload;
      state.selectedPoint = undefined;
    },
    setSelectedPoint(state, action: PayloadAction<Point | undefined>) {
      state.selectedPoint = action.payload;
    },
  },
});

export const { reducer: cityReducer, actions: cityActions } = citySlice;
