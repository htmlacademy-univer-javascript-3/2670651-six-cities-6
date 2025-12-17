import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CITY_MAP } from '../../../../pages/main/consts/consts';
import type { Points } from '../../../types/map';
import { URL_MARKER_CURRENT, URL_MARKER_DEFAULT } from '../consts';
import LeafletMap from './LeafletMap';

const mapInstance = vi.hoisted(() => ({
  removeLayer: vi.fn(),
  fitBounds: vi.fn(),
  setView: vi.fn(),
}));

const useMapMock = vi.hoisted(() => vi.fn(() => mapInstance));

const leafletMock = vi.hoisted(() => {
  const markers: Array<{
    setIcon: ReturnType<typeof vi.fn>;
    on: (event: string, cb: () => void) => unknown;
    addTo: (layer: unknown) => unknown;
    fire: (event: string) => void;
  }> = [];

  const markerLayer = {
    addTo: vi.fn(),
    clearLayers: vi.fn(),
  };

  markerLayer.addTo.mockImplementation(() => markerLayer);

  class Icon {
    options: { iconUrl: string };
    constructor(options: { iconUrl: string }) {
      this.options = options;
    }
  }

  class LatLngBounds {
    constructor(_bounds: unknown[]) {
      // noop
    }
    extend = vi.fn();
  }

  class Marker {
    private handlers: Record<string, () => void> = {};
    setIcon = vi.fn();

    constructor(_coords: unknown) {
      markers.push(this);
    }

    addTo(_layer: unknown) {
      return this;
    }

    on(event: string, cb: () => void) {
      this.handlers[event] = cb;
      return this;
    }

    fire(event: string) {
      this.handlers[event]?.();
    }
  }

  const layerGroup = vi.fn(() => markerLayer);

  return { Icon, LatLngBounds, Marker, layerGroup, markers, markerLayer };
});

vi.mock('../../../lib/map/use-map', () => ({
  default: useMapMock,
}));

vi.mock('leaflet', () => ({
  Icon: leafletMock.Icon,
  Marker: leafletMock.Marker,
  layerGroup: leafletMock.layerGroup,
  LatLngBounds: leafletMock.LatLngBounds,
}));

describe('LeafletMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leafletMock.markers.length = 0;
  });

  it('creates markers, sets icons and calls onMarkerClick on marker click', async () => {
    const onMarkerClick = vi.fn();

    const points: Points = [
      { title: 'Point 1', lat: 52.3, lng: 4.9 },
      { title: 'Point 2', lat: 52.4, lng: 5.0 },
    ];

    render(
      <LeafletMap
        city={CITY_MAP.AMSTERDAM}
        points={points}
        selectedPoint={points[0]}
        onMarkerClick={onMarkerClick}
      />
    );

    await waitFor(() => {
      expect(leafletMock.markers).toHaveLength(2);
    });

    await waitFor(() => {
      expect(mapInstance.fitBounds).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(leafletMock.markers[0].setIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ iconUrl: URL_MARKER_CURRENT }),
        })
      );
      expect(leafletMock.markers[1].setIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ iconUrl: URL_MARKER_DEFAULT }),
        })
      );
    });

    leafletMock.markers[0].fire('click');
    expect(onMarkerClick).toHaveBeenCalledWith(points[0]);
  });
});

