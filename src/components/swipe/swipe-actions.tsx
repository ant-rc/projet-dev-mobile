import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';
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
        icon="✕"
        color={Palette.danger}
        backgroundColor={buttonBackground}
        onPress={handleSkip}
        disabled={disabled}
        accessibilityLabel="Passer ce restaurant"
      />
      <ActionButton
        icon="♥"
        color={Palette.success}
        backgroundColor={buttonBackground}
        onPress={handleLike}
        disabled={disabled}
        accessibilityLabel="Aimer ce restaurant"
      />
    </View>
  );
}

interface ActionButtonProps {
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
}

function ActionButton({
  icon,
  color,
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
        { borderColor: color, backgroundColor },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.icon, { color }]}>{icon}</Text>
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
  icon: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
