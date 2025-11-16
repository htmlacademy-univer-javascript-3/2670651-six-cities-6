import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup, LatLngBounds } from 'leaflet';
import useMap from '../../../lib/map/use-map';
import type { City, Points, Point } from '../../../types/map';
import 'leaflet/dist/leaflet.css';
import { URL_MARKER_CURRENT, URL_MARKER_DEFAULT } from '../consts';

type MapProps = {
  city: City;
  points: Points;
  selectedPoint?: Point;
  onMarkerClick?: (point: Point) => void;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function Map(props: MapProps): JSX.Element {
  const { city, points, selectedPoint, onMarkerClick } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useMap(mapRef, city);

  const isSamePoint = (a?: Point, b?: Point) =>
    !!a && !!b && a.lat === b.lat && a.lng === b.lng;

  useEffect(() => {
    if (!map) {
      return;
    }

    const markerLayer = layerGroup().addTo(map);
    const bounds = new LatLngBounds([]);

    points.forEach((point) => {
      const marker = new Marker({ lat: point.lat, lng: point.lng });

      marker
        .setIcon(
          isSamePoint(point, selectedPoint)
            ? currentCustomIcon
            : defaultCustomIcon
        )
        .addTo(markerLayer)
        .on('click', () => onMarkerClick?.(point));

      bounds.extend([point.lat, point.lng]);
    });

    if (points.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      map.setView({ lat: city.lat, lng: city.lng }, city.zoom);
    }

    return () => {
      map.removeLayer(markerLayer);
    };
  }, [
    map,
    points,
    selectedPoint,
    onMarkerClick,
    city.lat,
    city.lng,
    city.zoom,
  ]);

  useEffect(() => {
    if (map && selectedPoint) {
      map.panTo({ lat: selectedPoint.lat, lng: selectedPoint.lng });
    }
  }, [map, selectedPoint]);

  return <div style={{ height: '650px' }} ref={mapRef}></div>;
}

export default Map;
