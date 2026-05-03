import { Info } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

import { RestaurantCard } from '@/src/components/restaurant';
import { SWIPE_THRESHOLD_PIXELS } from '@/src/constants/config';
import { Palette, Radii, Spacing } from '@/src/constants/theme';
import { useHaptics } from '@/src/hooks/use-haptics';
import { useSwipeGesture } from '@/src/hooks/use-swipe-gesture';
import type { Restaurant, SwipeDirection } from '@/src/types/models';

import { SwipeOverlay } from './swipe-overlay';

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipe: (direction: SwipeDirection) => void;
  onInfoPress?: () => void;
}

export function SwipeCard({ restaurant, onSwipe, onInfoPress }: SwipeCardProps) {
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
        {onInfoPress && (
          <Pressable
            onPress={onInfoPress}
            style={({ pressed }) => [styles.infoButton, pressed && styles.infoPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Voir les détails de ${restaurant.name}`}
            hitSlop={8}
          >
            <Info size={22} color={Palette.white} strokeWidth={2.5} />
          </Pressable>
        )}
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
  infoButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
