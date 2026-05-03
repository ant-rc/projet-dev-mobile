import type { Event, Match, Participant, Restaurant, Swipe, User, UUID } from '@/src/types/models';

import type { AppState } from './types';

export const selectUser = (state: AppState): User | null => state.user;

export const selectAllEvents = (state: AppState): Event[] =>
  Object.values(state.events).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const selectEventById = (state: AppState, eventId: UUID): Event | undefined =>
  state.events[eventId];

export const selectParticipants = (state: AppState, eventId: UUID): Participant[] =>
  state.participantsByEvent[eventId] ?? [];

export const selectAllSwipes = (state: AppState, eventId: UUID): Swipe[] =>
  state.swipesByEvent[eventId] ?? [];

export const selectUserSwipes = (state: AppState, eventId: UUID, userId: UUID): Swipe[] =>
  selectAllSwipes(state, eventId).filter((s) => s.userId === userId);

export const selectRestaurants = (state: AppState, eventId: UUID): Restaurant[] =>
  state.restaurantsByEvent[eventId] ?? [];

export const selectRestaurantsToSwipe = (
  state: AppState,
  eventId: UUID,
  userId: UUID,
): Restaurant[] => {
  const restaurants = selectRestaurants(state, eventId);
  const swipedIds = new Set(selectUserSwipes(state, eventId, userId).map((s) => s.restaurantId));
  return restaurants.filter((r) => !swipedIds.has(r.id));
};

export const selectMatch = (state: AppState, eventId: UUID): Match | null =>
  state.matchByEvent[eventId] ?? null;

export const selectIsLoading = (state: AppState): boolean => state.status === 'loading';

export const selectError = (state: AppState): string | null => state.error;
