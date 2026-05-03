import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';
import type { Restaurant } from '@/src/types/models';

import { PriceIndicator } from './price-indicator';
import { RatingBadge } from './rating-badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  style?: StyleProp<ViewStyle>;
}

export function RestaurantCard({ restaurant, style }: RestaurantCardProps) {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1f1f23' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor(
    { light: Palette.mutedLight, dark: Palette.mutedDark },
    'icon',
  );

  const tagsLabel = restaurant.tags.slice(0, 3).join(' · ') || '—';

  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      {restaurant.photoUrl ? (
        <Image
          source={{ uri: restaurant.photoUrl }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
          accessibilityLabel={`Photo du restaurant ${restaurant.name}`}
        />
      ) : (
        <View style={[styles.photo, styles.photoFallback]}>
          <Text style={styles.fallbackEmoji}>🍽️</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
            {restaurant.name}
          </Text>
          <RatingBadge rating={restaurant.rating} />
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.tags, { color: mutedColor }]} numberOfLines={1}>
            {tagsLabel}
          </Text>
          <PriceIndicator priceLevel={restaurant.priceLevel} size="sm" />
        </View>

        <Text style={[styles.address, { color: mutedColor }]} numberOfLines={1}>
          {restaurant.address}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Palette.borderLight,
  },
  photoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: FontSize.xxxl * 1.5,
  },
  info: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  name: {
    flex: 1,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  tags: {
    flex: 1,
    fontSize: FontSize.sm,
  },
  address: {
    fontSize: FontSize.sm,
  },
});
