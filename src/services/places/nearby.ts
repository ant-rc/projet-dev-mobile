import { hasGooglePlacesKey } from '@/src/constants/config';
import type { GooglePlacesNearbyResponse } from '@/src/types/api';
import type { PriceLevel, Restaurant } from '@/src/types/models';

import { placesGet } from './client';
import { mapNearbyToRestaurant } from './mappers';
import { MOCK_RESTAURANTS } from './mock';

export interface SearchNearbyParams {
  lat: number;
  lng: number;
  radiusMeters: number;
  priceLevels?: PriceLevel[];
  minRating?: number;
}

function filterMock(params: SearchNearbyParams): Restaurant[] {
  return MOCK_RESTAURANTS.filter((r) => {
    if (params.priceLevels && r.priceLevel !== null && !params.priceLevels.includes(r.priceLevel)) {
      return false;
    }
    if (params.minRating !== undefined && (r.rating ?? 0) < params.minRating) {
      return false;
    }
    return true;
  });
}

export async function searchNearby(params: SearchNearbyParams): Promise<Restaurant[]> {
  if (!hasGooglePlacesKey()) {
    return filterMock(params);
  }

  const query: Record<string, string> = {
    location: `${params.lat},${params.lng}`,
    radius: String(params.radiusMeters),
    type: 'restaurant',
  };
  if (params.priceLevels && params.priceLevels.length > 0) {
    query.minprice = String(Math.min(...params.priceLevels));
    query.maxprice = String(Math.max(...params.priceLevels));
  }

  const data = await placesGet<GooglePlacesNearbyResponse>('/nearbysearch/json', query);
  if (data.status === 'ZERO_RESULTS') return [];

  const restaurants = data.results.map(mapNearbyToRestaurant);
  if (params.minRating === undefined) return restaurants;
  return restaurants.filter((r) => (r.rating ?? 0) >= (params.minRating ?? 0));
}
