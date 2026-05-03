import { Heart, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Palette, Radii, Spacing } from '@/src/constants/theme';
import { useHaptics } from '@/src/hooks/use-haptics';

interface SwipeActionsProps {
  onLike: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function SwipeActions({ onLike, onSkip, disabled = false }: SwipeActionsProps) {
  const { medium } = useHaptics();
  const buttonBackground = useThemeColor({ light: '#ffffff', dark: '#27272a' }, 'background');

  const handleSkip = (): void => {
    medium();
    onSkip();
  };

  const handleLike = (): void => {
    medium();
    onLike();
  };

  return (
    <View style={styles.container}>
      <ActionButton
        icon={<X size={32} color={Palette.danger} strokeWidth={3} />}
        borderColor={Palette.danger}
        backgroundColor={buttonBackground}
        onPress={handleSkip}
        disabled={disabled}
        accessibilityLabel="Passer ce restaurant"
      />
      <ActionButton
        icon={
          <Heart size={32} color={Palette.success} fill={Palette.success} strokeWidth={3} />
        }
        borderColor={Palette.success}
        backgroundColor={buttonBackground}
        onPress={handleLike}
        disabled={disabled}
        accessibilityLabel="Aimer ce restaurant"
      />
    </View>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  borderColor: string;
  backgroundColor: string;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
}

function ActionButton({
  icon,
  borderColor,
  backgroundColor,
  onPress,
  disabled,
  accessibilityLabel,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { borderColor, backgroundColor },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxxl,
    paddingVertical: Spacing.lg,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: Radii.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
