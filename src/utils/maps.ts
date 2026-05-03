import type { Restaurant } from '@/src/types/models';

const MOCK_ID_PREFIX = 'mock-';
const MAPS_BASE_URL = 'https://www.google.com/maps/search/';

export function buildMapsUrl(restaurant: Restaurant): string {
  const query = encodeURIComponent(`${restaurant.name}, ${restaurant.address}`);
  const isGooglePlace = !restaurant.id.startsWith(MOCK_ID_PREFIX);
  if (isGooglePlace) {
    return `${MAPS_BASE_URL}?api=1&query=${query}&query_place_id=${restaurant.id}`;
  }
  return `${MAPS_BASE_URL}?api=1&query=${query}`;
}
