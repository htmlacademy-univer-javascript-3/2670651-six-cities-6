import { memo, useEffect, useRef } from 'react';
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

const areSamePoint = (a?: Point, b?: Point): boolean =>
  !!a && !!b && a.lat === b.lat && a.lng === b.lng;

function LeafletMapBase(props: MapProps): JSX.Element {
  const { city, points, selectedPoint, onMarkerClick } = props;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useMap(mapRef, city);

  const markerLayerRef = useRef<ReturnType<typeof layerGroup> | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const pointsRef = useRef<Points>([]);
  const onMarkerClickRef = useRef<MapProps['onMarkerClick']>();

  useEffect(() => {
    if (!map) {
      return;
    }

    const markerLayer = layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;

    return () => {
      map.removeLayer(markerLayer);
      markerLayerRef.current = null;
      markersRef.current = [];
      pointsRef.current = [];
    };
  }, [map]);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    if (!map || !markerLayerRef.current) {
      return;
    }

    const markerLayer = markerLayerRef.current;
    markerLayer.clearLayers();
    markersRef.current = [];
    pointsRef.current = points;

    const bounds = new LatLngBounds([]);

    points.forEach((point) => {
      const marker = new Marker({ lat: point.lat, lng: point.lng });
      marker
        .addTo(markerLayer)
        .on('click', () => onMarkerClickRef.current?.(point));

      markersRef.current.push(marker);
      bounds.extend([point.lat, point.lng]);
    });

    if (points.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      map.setView({ lat: city.lat, lng: city.lng }, city.zoom);
    }
  }, [map, points, city.lat, city.lng, city.zoom]);

  useEffect(() => {
    const currentPoints = pointsRef.current;
    const markers = markersRef.current;

    if (!markers.length || !currentPoints.length) {
      return;
    }

    markers.forEach((marker, index) => {
      const point = currentPoints[index];
      marker.setIcon(
        areSamePoint(point, selectedPoint)
          ? currentCustomIcon
          : defaultCustomIcon
      );
    });
  }, [selectedPoint, points]);

  return <div style={{ height: '600px' }} ref={mapRef} />;
}

const LeafletMap = memo(LeafletMapBase);
LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
