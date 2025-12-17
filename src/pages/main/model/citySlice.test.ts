import { describe, expect, it } from 'vitest';
import { cityActions, cityReducer } from './citySlice';
import type { Point } from '../../../shared/types/map';

describe('citySlice reducer', () => {
  it('should return initial state on unknown action', () => {
    const state = cityReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      currentCityKey: 'PARIS',
      selectedPoint: undefined,
    });
  });

  it('should set city key and reset selected point', () => {
    const initialPoint: Point = { lat: 1, lng: 2, title: 'Amsterdam' };
    const initialState = {
      currentCityKey: 'PARIS' as const,
      selectedPoint: initialPoint,
    };

    const state = cityReducer(initialState, cityActions.setCityKey('PARIS'));

    expect(state.currentCityKey).toBe('PARIS');
    expect(state.selectedPoint).toBeUndefined();
  });

  it('should set selected point', () => {
    const point: Point = { lat: 52.3, lng: 4.9, title: 'Some place' };

    const state = cityReducer(
      undefined,
      cityActions.setSelectedPoint(point)
    );

    expect(state.selectedPoint).toEqual(point);
  });
});
