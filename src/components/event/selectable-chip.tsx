import { Pressable, StyleSheet, Text } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function SelectableChip({
  label,
  selected,
  onPress,
  accessibilityLabel,
}: SelectableChipProps) {
  const inactiveBackground = useThemeColor(
    { light: '#f4f4f5', dark: '#27272a' },
    'background',
  );
  const inactiveText = useThemeColor({}, 'text');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: Palette.primary, borderColor: Palette.primary }
          : { backgroundColor: inactiveBackground, borderColor: 'transparent' },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: selected ? Palette.white : inactiveText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1.5,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
