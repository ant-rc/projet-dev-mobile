import { hasGooglePlacesKey } from '@/src/constants/config';
import type { GooglePlacesDetailsResponse } from '@/src/types/api';
import type { Restaurant } from '@/src/types/models';

import { placesGet } from './client';
import { mapDetailsToRestaurant } from './mappers';
import { MOCK_RESTAURANTS } from './mock';

const DETAILS_FIELDS = [
  'place_id',
  'name',
  'rating',
  'price_level',
  'geometry/location',
  'formatted_address',
  'vicinity',
  'types',
  'photos',
  'formatted_phone_number',
  'website',
  'opening_hours/weekday_text',
].join(',');

export async function getDetails(placeId: string): Promise<Restaurant | null> {
  if (!hasGooglePlacesKey()) {
    return MOCK_RESTAURANTS.find((r) => r.id === placeId) ?? null;
  }

  const data = await placesGet<GooglePlacesDetailsResponse>('/details/json', {
    place_id: placeId,
    fields: DETAILS_FIELDS,
  });

  if (data.status === 'NOT_FOUND' || !data.result) return null;
  return mapDetailsToRestaurant(data.result);
}
