import { GOOGLE_PLACES_BASE_URL, GOOGLE_PLACES_KEY } from '@/src/constants/config';

export class GooglePlacesError extends Error {
  constructor(
    message: string,
    public readonly status?: string,
  ) {
    super(message);
    this.name = 'GooglePlacesError';
  }
}

function buildUrl(path: string, params: Record<string, string>): string {
  const search = new URLSearchParams({ ...params, key: GOOGLE_PLACES_KEY }).toString();
  return `${GOOGLE_PLACES_BASE_URL}${path}?${search}`;
}

export async function placesGet<T extends { status: string; error_message?: string }>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const url = buildUrl(path, params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new GooglePlacesError(`HTTP ${response.status}`, String(response.status));
  }
  const json = (await response.json()) as T;
  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new GooglePlacesError(json.error_message ?? `Places error: ${json.status}`, json.status);
  }
  return json;
}

export function getPhotoUrl(photoReference: string, maxWidth = 800): string {
  return `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_KEY}`;
}
