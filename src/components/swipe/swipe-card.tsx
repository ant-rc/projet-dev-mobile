import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

import { RestaurantCard } from '@/src/components/restaurant';
import { SWIPE_THRESHOLD_PIXELS } from '@/src/constants/config';
import { Radii } from '@/src/constants/theme';
import { useHaptics } from '@/src/hooks/use-haptics';
import { useSwipeGesture } from '@/src/hooks/use-swipe-gesture';
import type { Restaurant, SwipeDirection } from '@/src/types/models';

import { SwipeOverlay } from './swipe-overlay';

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipe: (direction: SwipeDirection) => void;
}

export function SwipeCard({ restaurant, onSwipe }: SwipeCardProps) {
  const { light } = useHaptics();
  const { gesture, animatedStyle, translateX } = useSwipeGesture({ onSwipe });

  useAnimatedReaction(
    () => Math.abs(translateX.value) > SWIPE_THRESHOLD_PIXELS,
    (isOver, wasOver) => {
      if (isOver && !wasOver) {
        runOnJS(light)();
      }
    },
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <RestaurantCard restaurant={restaurant} style={styles.card} />
        <SwipeOverlay translateX={translateX} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Radii.lg,
  },
  card: {
    flex: 1,
  },
});
