import type { Match, Restaurant, Swipe, UUID } from '@/src/types/models';

function countUniqueLikes(swipes: Swipe[], restaurantId: string): number {
  const directionByUser = new Map<UUID, Swipe['direction']>();
  for (const swipe of swipes) {
    if (swipe.restaurantId === restaurantId) {
      directionByUser.set(swipe.userId, swipe.direction);
    }
  }
  let likes = 0;
  for (const direction of directionByUser.values()) {
    if (direction === 'like') likes += 1;
  }
  return likes;
}

export function detectMatch(
  restaurantId: string,
  swipes: Swipe[],
  totalSwipers: number,
  threshold: number,
  eventId: UUID,
): Match | null {
  if (totalSwipers <= 0) return null;
  const likeCount = countUniqueLikes(swipes, restaurantId);
  const ratio = likeCount / totalSwipers;
  if (ratio < threshold) return null;

  return {
    eventId,
    restaurantId,
    matchedAt: new Date().toISOString(),
    likeCount,
    participantCount: totalSwipers,
  };
}

export function findMatchInEvent(
  restaurants: Restaurant[],
  swipes: Swipe[],
  totalSwipers: number,
  threshold: number,
  eventId: UUID,
): Match | null {
  for (const restaurant of restaurants) {
    const match = detectMatch(restaurant.id, swipes, totalSwipers, threshold, eventId);
    if (match) return match;
  }
  return null;
}
