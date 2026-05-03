import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

interface UseHapticsResult {
  light: () => void;
  medium: () => void;
  success: () => void;
  error: () => void;
}

export function useHaptics(): UseHapticsResult {
  const light = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const medium = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const success = useCallback((): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const error = useCallback((): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  return { light, medium, success, error };
}
