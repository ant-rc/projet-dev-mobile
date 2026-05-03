import { useCallback } from 'react';

import { useApp } from '@/src/store/app-context';
import {
  selectAllSwipes,
  selectEventById,
  selectFriends,
  selectRestaurants,
  selectTotalSwipersCount,
} from '@/src/store/selectors';
import type { Match, Swipe, SwipeDirection, UUID } from '@/src/types/models';
import { createSwipe } from '@/src/utils/factories';
import { detectMatch } from '@/src/utils/match';
import { simulateFriendSwipe } from '@/src/utils/simulate-swipe';

interface UseSwipeActionResult {
  swipe: (restaurantId: string, direction: SwipeDirection) => Match | null;
}

export function useSwipeAction(eventId: UUID): UseSwipeActionResult {
  const { state, dispatch } = useApp();

  const swipe = useCallback(
    (restaurantId: string, direction: SwipeDirection): Match | null => {
      if (!state.user) return null;
      const event = selectEventById(state, eventId);
      if (!event) return null;

      const restaurants = selectRestaurants(state, eventId);
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (!restaurant) return null;

      const friends = selectFriends(state, eventId);
      const totalSwipers = selectTotalSwipersCount(state, eventId);
      const existingSwipes = selectAllSwipes(state, eventId);

      const userSwipe = createSwipe({
        eventId,
        userId: state.user.id,
        restaurantId,
        direction,
      });
      dispatch({ type: 'SWIPE_RECORD', payload: userSwipe });

      const friendSwipes: Swipe[] = friends.map((friend) =>
        createSwipe({
          eventId,
          userId: friend.id,
          restaurantId,
          direction: simulateFriendSwipe(friend, restaurant),
        }),
      );
      for (const fs of friendSwipes) {
        dispatch({ type: 'SWIPE_RECORD', payload: fs });
      }

      const allSwipes: Swipe[] = [...existingSwipes, userSwipe, ...friendSwipes];
      const match = detectMatch(
        restaurantId,
        allSwipes,
        totalSwipers,
        event.matchThreshold,
        eventId,
      );
      if (match) {
        dispatch({ type: 'MATCH_SET', payload: { eventId, match } });
      }
      return match;
    },
    [state, dispatch, eventId],
  );

  return { swipe };
}
