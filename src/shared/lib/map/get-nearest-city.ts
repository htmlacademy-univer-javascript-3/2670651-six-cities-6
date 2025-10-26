import { CITY_MAP, CityData } from '../../../pages/main/consts/consts';

export function getNearestCity(lat: number, lng: number): CityData {
  let nearest: CityData = CITY_MAP.AMSTERDAM;
  let min = Infinity;
  for (const data of Object.values(CITY_MAP)) {
    const dLat = lat - data.lat;
    const dLng = lng - data.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < min) {
      min = dist;
      nearest = data;
    }
  }
  return nearest;
}
