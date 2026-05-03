import { StyleSheet, View } from 'react-native';

import { RestaurantCard } from '@/src/components/restaurant';
import { EmptyState } from '@/src/components/ui';
import { MAX_SWIPE_STACK_VISIBLE } from '@/src/constants/config';
import type { Restaurant, SwipeDirection } from '@/src/types/models';

import { SwipeCard } from './swipe-card';

interface SwipeStackProps {
  restaurants: Restaurant[];
  onSwipe: (restaurantId: string, direction: SwipeDirection) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const SCALE_STEP = 0.04;
const TRANSLATE_Y_STEP = 8;

export function SwipeStack({
  restaurants,
  onSwipe,
  emptyTitle = 'Plus de restaurants',
  emptyDescription = 'Tu as tout swipé pour ce groupe.',
}: SwipeStackProps) {
  if (restaurants.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const visible = restaurants.slice(0, MAX_SWIPE_STACK_VISIBLE);
  const inRenderOrder = [...visible].reverse();

  return (
    <View style={styles.container}>
      {inRenderOrder.map((restaurant, indexInRender) => {
        const depth = visible.length - 1 - indexInRender;
        const isTop = depth === 0;
        const scale = 1 - depth * SCALE_STEP;
        const translateY = depth * TRANSLATE_Y_STEP;

        return (
          <View
            key={restaurant.id}
            style={[styles.cardSlot, { transform: [{ scale }, { translateY }] }]}
            pointerEvents={isTop ? 'auto' : 'none'}
          >
            {isTop ? (
              <SwipeCard
                restaurant={restaurant}
                onSwipe={(direction) => onSwipe(restaurant.id, direction)}
              />
            ) : (
              <RestaurantCard restaurant={restaurant} style={styles.staticCard} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  cardSlot: {
    ...StyleSheet.absoluteFillObject,
  },
  staticCard: {
    flex: 1,
  },
});
