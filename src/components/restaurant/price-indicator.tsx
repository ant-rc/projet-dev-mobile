import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette } from '@/src/constants/theme';
import type { PriceLevel } from '@/src/types/models';

interface PriceIndicatorProps {
  priceLevel: PriceLevel | null;
  size?: 'sm' | 'md';
}

export function PriceIndicator({ priceLevel, size = 'md' }: PriceIndicatorProps) {
  const mutedColor = useThemeColor(
    { light: Palette.borderLight, dark: Palette.borderDark },
    'icon',
  );
  const fontSize = size === 'sm' ? FontSize.sm : FontSize.md;

  if (priceLevel === null) {
    return <Text style={[{ fontSize, color: mutedColor }, styles.label]}>—</Text>;
  }

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`Niveau de prix ${priceLevel} sur 4`}
    >
      {[1, 2, 3, 4].map((level) => (
        <Text
          key={level}
          style={[
            styles.label,
            { fontSize, color: level <= priceLevel ? Palette.primary : mutedColor },
          ]}
        >
          €
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontWeight: '600' },
});
