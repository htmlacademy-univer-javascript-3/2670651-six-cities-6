import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { cityActions } from '../../../pages/main/model/citySlice';
import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import { useAppDispatch, useAppSelector } from './redux';

describe('redux hooks', () => {
  it('useAppDispatch and useAppSelector work with the store', () => {
    const store = configureStore({ reducer: rootReducer });

    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(
      () => {
        const dispatch = useAppDispatch();
        const cityKey = useAppSelector((state) => state.city.currentCityKey);
        return { dispatch, cityKey };
      },
      { wrapper }
    );

    expect(result.current.cityKey).toBe('PARIS');

    act(() => {
      result.current.dispatch(cityActions.setCityKey('AMSTERDAM'));
    });

    expect(result.current.cityKey).toBe('AMSTERDAM');
  });
});
