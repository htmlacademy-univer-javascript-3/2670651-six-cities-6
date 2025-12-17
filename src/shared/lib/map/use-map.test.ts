import { renderHook, waitFor } from '@testing-library/react';
import type { MutableRefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CITY_MAP } from '../../../pages/main/consts/consts';
import useMap from './use-map';

const leafletMock = vi.hoisted(() => {
  let mapInstance: unknown;
  let tileLayerInstance: unknown;

  const Map = vi.fn(() => mapInstance);
  const TileLayer = vi.fn(() => tileLayerInstance);

  return {
    Map,
    TileLayer,
    setMapInstance: (instance: unknown) => {
      mapInstance = instance;
    },
    setTileLayerInstance: (instance: unknown) => {
      tileLayerInstance = instance;
    },
  };
});

vi.mock('leaflet', () => ({
  Map: leafletMock.Map,
  TileLayer: leafletMock.TileLayer,
}));

describe('useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes a map instance once and adds a tile layer', async () => {
    const mapInstance = { addLayer: vi.fn(), setView: vi.fn() };
    const tileLayerInstance = {};
    leafletMock.setMapInstance(mapInstance);
    leafletMock.setTileLayerInstance(tileLayerInstance);

    const mapDiv = document.createElement('div');
    const mapRef = {
      current: mapDiv,
    } as MutableRefObject<HTMLElement | null>;

    const { result } = renderHook(() => useMap(mapRef, CITY_MAP.AMSTERDAM));

    await waitFor(() => {
      expect(result.current).toBe(mapInstance);
    });

    expect(leafletMock.Map).toHaveBeenCalledTimes(1);
    expect(leafletMock.TileLayer).toHaveBeenCalledTimes(1);
    expect(mapInstance.addLayer).toHaveBeenCalledWith(tileLayerInstance);
  });

  it('updates view on city change without recreating the map', async () => {
    const mapInstance = { addLayer: vi.fn(), setView: vi.fn() };
    const tileLayerInstance = {};
    leafletMock.setMapInstance(mapInstance);
    leafletMock.setTileLayerInstance(tileLayerInstance);

    const mapDiv = document.createElement('div');
    const mapRef = {
      current: mapDiv,
    } as MutableRefObject<HTMLElement | null>;

    const { result, rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      { initialProps: { city: CITY_MAP.AMSTERDAM } }
    );

    await waitFor(() => {
      expect(result.current).toBe(mapInstance);
    });

    mapInstance.setView.mockClear();

    rerender({ city: CITY_MAP.PARIS });

    await waitFor(() => {
      expect(mapInstance.setView).toHaveBeenCalledWith(
        { lat: CITY_MAP.PARIS.lat, lng: CITY_MAP.PARIS.lng },
        CITY_MAP.PARIS.zoom
      );
    });

    expect(leafletMock.Map).toHaveBeenCalledTimes(1);
  });
});

