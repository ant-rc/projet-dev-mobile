export type UUID = string;

export type ISODateString = string;

export interface User {
  id: UUID;
  pseudo: string;
  avatarColor: string;
  createdAt: ISODateString;
}

export type EventStatus = 'lobby' | 'swiping' | 'matched' | 'cancelled';

export type PriceLevel = 1 | 2 | 3 | 4;

export type PlaceType = 'restaurant' | 'bar' | 'cafe' | 'bakery' | 'night_club';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface EventFilters {
  location: GeoPoint & { radiusMeters: number };
  placeType: PlaceType;
  priceLevels: PriceLevel[];
  cuisineTags: string[];
}

export interface Event {
  id: UUID;
  code: string;
  name: string;
  hostId: UUID;
  status: EventStatus;
  matchThreshold: number;
  filters: EventFilters;
  createdAt: ISODateString;
}

export interface Participant {
  eventId: UUID;
  userId: UUID;
  joinedAt: ISODateString;
}

export interface Restaurant {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number | null;
  priceLevel: PriceLevel | null;
  location: GeoPoint;
  address: string;
  tags: string[];
  phone?: string;
  website?: string;
  openingHours?: string[];
}

export interface FriendPreferences {
  likedTags: string[];
  dislikedTags: string[];
  preferredPriceLevels: PriceLevel[];
  minRating: number;
}

export interface FriendProfile {
  id: UUID;
  pseudo: string;
  avatarColor: string;
  preferences: FriendPreferences;
}

export type SwipeDirection = 'like' | 'skip';

export interface Swipe {
  id: UUID;
  eventId: UUID;
  userId: UUID;
  restaurantId: string;
  direction: SwipeDirection;
  createdAt: ISODateString;
}

export interface Match {
  eventId: UUID;
  restaurantId: string;
  matchedAt: ISODateString;
  likeCount: number;
  participantCount: number;
}
