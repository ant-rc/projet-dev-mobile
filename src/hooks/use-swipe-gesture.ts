import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { SWIPE_OUT_DURATION_MS, SWIPE_THRESHOLD_PIXELS } from '@/src/constants/config';
import type { SwipeDirection } from '@/src/types/models';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ROTATION_DEGREES_AT_EDGE = 8;
const EXIT_DISTANCE_FACTOR = 1.5;

interface UseSwipeGestureParams {
  onSwipe: (direction: SwipeDirection) => void;
  threshold?: number;
}

interface UseSwipeGestureResult {
  gesture: ReturnType<typeof Gesture.Pan>;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  translateX: SharedValue<number>;
  reset: () => void;
}

export function useSwipeGesture({
  onSwipe,
  threshold = SWIPE_THRESHOLD_PIXELS,
}: UseSwipeGestureParams): UseSwipeGestureResult {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reset = useCallback((): void => {
    translateX.value = 0;
    translateY.value = 0;
  }, [translateX, translateY]);

  const triggerSwipe = useCallback(
    (direction: SwipeDirection): void => {
      onSwipe(direction);
    },
    [onSwipe],
  );

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > threshold) {
        const direction: SwipeDirection = event.translationX > 0 ? 'like' : 'skip';
        const target =
          event.translationX > 0
            ? SCREEN_WIDTH * EXIT_DISTANCE_FACTOR
            : -SCREEN_WIDTH * EXIT_DISTANCE_FACTOR;
        translateX.value = withTiming(target, { duration: SWIPE_OUT_DURATION_MS });
        runOnJS(triggerSwipe)(direction);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = (translateX.value / SCREEN_WIDTH) * ROTATION_DEGREES_AT_EDGE;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  return { gesture, animatedStyle, translateX, reset };
}
