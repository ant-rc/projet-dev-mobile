import { DEFAULT_MATCH_THRESHOLD, DEFAULT_RADIUS_METERS } from '@/src/constants/config';
import type {
  Event,
  EventFilters,
  GeoPoint,
  PriceLevel,
  Swipe,
  SwipeDirection,
  User,
  UUID,
} from '@/src/types/models';

const AVATAR_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
];

export function randomId(): UUID {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${time}-${rand}`;
}

export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function generateEventCode(): string {
  const code = Math.floor(Math.random() * 1_000_000);
  return code.toString().padStart(6, '0');
}

export function createUser(pseudo: string): User {
  return {
    id: randomId(),
    pseudo,
    avatarColor: randomAvatarColor(),
    createdAt: new Date().toISOString(),
  };
}

export interface CreateEventInput {
  name: string;
  hostId: UUID;
  location: GeoPoint;
  radiusMeters?: number;
  priceLevels?: PriceLevel[];
  cuisineTags?: string[];
  matchThreshold?: number;
}

export function createEvent(input: CreateEventInput): Event {
  const filters: EventFilters = {
    location: {
      lat: input.location.lat,
      lng: input.location.lng,
      radiusMeters: input.radiusMeters ?? DEFAULT_RADIUS_METERS,
    },
    priceLevels: input.priceLevels ?? [],
    cuisineTags: input.cuisineTags ?? [],
  };
  return {
    id: randomId(),
    code: generateEventCode(),
    name: input.name,
    hostId: input.hostId,
    status: 'lobby',
    matchThreshold: input.matchThreshold ?? DEFAULT_MATCH_THRESHOLD,
    filters,
    createdAt: new Date().toISOString(),
  };
}

export interface CreateSwipeInput {
  eventId: UUID;
  userId: UUID;
  restaurantId: string;
  direction: SwipeDirection;
}

export function createSwipe(input: CreateSwipeInput): Swipe {
  return {
    id: randomId(),
    ...input,
    createdAt: new Date().toISOString(),
  };
}
