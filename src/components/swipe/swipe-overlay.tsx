import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { SWIPE_THRESHOLD_PIXELS } from '@/src/constants/config';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';

interface SwipeOverlayProps {
  translateX: SharedValue<number>;
}

export function SwipeOverlay({ translateX }: SwipeOverlayProps) {
  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD_PIXELS],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD_PIXELS, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.stamp, styles.likeStamp, likeStyle]}>
        <Text style={[styles.label, styles.likeLabel]}>LIKE</Text>
      </Animated.View>
      <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStyle]}>
        <Text style={[styles.label, styles.nopeLabel]}>NOPE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  stamp: {
    position: 'absolute',
    top: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 4,
  },
  likeStamp: {
    left: Spacing.xl,
    borderColor: Palette.success,
    transform: [{ rotate: '-12deg' }],
  },
  nopeStamp: {
    right: Spacing.xl,
    borderColor: Palette.danger,
    transform: [{ rotate: '12deg' }],
  },
  label: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    letterSpacing: 2,
  },
  likeLabel: { color: Palette.success },
  nopeLabel: { color: Palette.danger },
});
