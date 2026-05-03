import type {
  GooglePlaceDetailsResult,
  GooglePlaceNearbyResult,
} from '@/src/types/api';
import type { PriceLevel, Restaurant } from '@/src/types/models';

import { getPhotoUrl } from './client';

const GENERIC_TYPES = new Set([
  'restaurant',
  'food',
  'establishment',
  'point_of_interest',
  'meal_takeaway',
  'meal_delivery',
  'store',
]);

function clampPriceLevel(value: number | undefined): PriceLevel | null {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value;
  return null;
}

function extractTags(types: string[] | undefined): string[] {
  if (!types) return [];
  return types
    .filter((t) => !GENERIC_TYPES.has(t))
    .map((t) => t.replace(/_restaurant$/, '').replace(/_/g, ' '));
}

function firstPhotoUrl(photos: GooglePlaceNearbyResult['photos']): string | null {
  const first = photos?.[0];
  return first ? getPhotoUrl(first.photo_reference) : null;
}

export function mapNearbyToRestaurant(raw: GooglePlaceNearbyResult): Restaurant {
  return {
    id: raw.place_id,
    name: raw.name,
    photoUrl: firstPhotoUrl(raw.photos),
    rating: raw.rating ?? null,
    priceLevel: clampPriceLevel(raw.price_level),
    location: raw.geometry.location,
    address: raw.vicinity ?? '',
    tags: extractTags(raw.types),
  };
}

export function mapDetailsToRestaurant(raw: GooglePlaceDetailsResult): Restaurant {
  return {
    ...mapNearbyToRestaurant(raw),
    address: raw.formatted_address ?? raw.vicinity ?? '',
    phone: raw.formatted_phone_number,
    website: raw.website,
    openingHours: raw.opening_hours?.weekday_text,
  };
}
