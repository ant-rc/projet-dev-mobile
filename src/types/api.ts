export type GooglePlacesStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'NOT_FOUND'
  | 'UNKNOWN_ERROR';

export interface GooglePlaceLocation {
  lat: number;
  lng: number;
}

export interface GooglePlaceGeometry {
  location: GooglePlaceLocation;
}

export interface GooglePlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
}

export interface GooglePlaceOpeningHours {
  weekday_text?: string[];
}

export interface GooglePlaceNearbyResult {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  geometry: GooglePlaceGeometry;
  vicinity?: string;
  types?: string[];
  photos?: GooglePlacePhoto[];
  business_status?: string;
}

export interface GooglePlaceDetailsResult extends GooglePlaceNearbyResult {
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: GooglePlaceOpeningHours;
}

export interface GooglePlacesNearbyResponse {
  status: GooglePlacesStatus;
  error_message?: string;
  results: GooglePlaceNearbyResult[];
  next_page_token?: string;
}

export interface GooglePlacesDetailsResponse {
  status: GooglePlacesStatus;
  error_message?: string;
  result?: GooglePlaceDetailsResult;
}
