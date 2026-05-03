export const GOOGLE_PLACES_KEY: string = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ?? '';

export const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export function hasGooglePlacesKey(): boolean {
  return GOOGLE_PLACES_KEY.length > 0;
}

export const DEFAULT_RADIUS_METERS = 1500;

export const DEFAULT_MATCH_THRESHOLD = 1.0;

export const MAX_SWIPE_STACK_VISIBLE = 3;

export const SWIPE_THRESHOLD_PIXELS = 120;

export const SWIPE_OUT_DURATION_MS = 250;
