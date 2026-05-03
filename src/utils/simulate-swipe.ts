import type {
  FriendPreferences,
  FriendProfile,
  Restaurant,
  SwipeDirection,
} from '@/src/types/models';

function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

function hasOverlap(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false;
  const set = new Set(a);
  return b.some((tag) => set.has(tag));
}

function violatesPriceLevel(prefs: FriendPreferences, restaurant: Restaurant): boolean {
  if (restaurant.priceLevel === null) return false;
  if (prefs.preferredPriceLevels.length === 0) return false;
  return !prefs.preferredPriceLevels.includes(restaurant.priceLevel);
}

function violatesRating(prefs: FriendPreferences, restaurant: Restaurant): boolean {
  if (prefs.minRating <= 0) return false;
  if (restaurant.rating === null) return false;
  return restaurant.rating < prefs.minRating;
}

const NEUTRAL_LIKE_PROBABILITY = 0.4;

export function simulateFriendSwipe(
  friend: FriendProfile,
  restaurant: Restaurant,
): SwipeDirection {
  const { preferences } = friend;

  if (violatesRating(preferences, restaurant)) return 'skip';
  if (violatesPriceLevel(preferences, restaurant)) return 'skip';
  if (hasOverlap(preferences.dislikedTags, restaurant.tags)) return 'skip';
  if (hasOverlap(preferences.likedTags, restaurant.tags)) return 'like';

  const seed = hashString(`${friend.id}:${restaurant.id}`);
  const normalized = (seed % 1000) / 1000;
  return normalized < NEUTRAL_LIKE_PROBABILITY ? 'like' : 'skip';
}

export function simulateAllFriendSwipes(
  friends: FriendProfile[],
  restaurant: Restaurant,
): Record<string, SwipeDirection> {
  const result: Record<string, SwipeDirection> = {};
  for (const friend of friends) {
    result[friend.id] = simulateFriendSwipe(friend, restaurant);
  }
  return result;
}
