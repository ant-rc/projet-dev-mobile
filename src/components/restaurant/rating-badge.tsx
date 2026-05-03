import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Spacing } from '@/src/constants/theme';

interface RatingBadgeProps {
  rating: number | null;
  size?: 'sm' | 'md';
}

export function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const textColor = useThemeColor({}, 'text');
  const fontSize = size === 'sm' ? FontSize.sm : FontSize.md;

  if (rating === null) return null;

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`Note ${rating.toFixed(1)} sur 5`}
    >
      <Text style={[styles.star, { fontSize }]}>★</Text>
      <Text style={[styles.value, { fontSize, color: textColor }]}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  star: { color: Palette.warning, fontWeight: '600' },
  value: { fontWeight: '600' },
});
