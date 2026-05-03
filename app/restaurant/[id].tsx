import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { PriceIndicator, RatingBadge } from '@/src/components/restaurant';
import { Button, EmptyState, Screen } from '@/src/components/ui';
import { FontSize, Palette, Spacing } from '@/src/constants/theme';
import { getDetails } from '@/src/services/places';
import { useApp } from '@/src/store/app-context';
import type { Restaurant } from '@/src/types/models';
import { buildMapsUrl } from '@/src/utils/maps';

function findRestaurantInStore(
  byEvent: Record<string, Restaurant[]>,
  id: string,
): Restaurant | null {
  for (const list of Object.values(byEvent)) {
    const found = list.find((r) => r.id === id);
    if (found) return found;
  }
  return null;
}

function needsEnrichment(restaurant: Restaurant | null): boolean {
  if (!restaurant) return true;
  return !restaurant.phone && !restaurant.website && !restaurant.openingHours;
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();

  const initial = findRestaurantInStore(state.restaurantsByEvent, id);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!needsEnrichment(restaurant)) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDetails(id)
      .then((details) => {
        if (cancelled) return;
        if (details) setRestaurant(details);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, restaurant]);

  if (loading && !restaurant) {
    return (
      <Screen padding="lg">
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (!restaurant) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Restaurant introuvable"
          description={error ?? "Cette fiche n'est pas disponible."}
          action={{ label: 'Retour', onPress: () => router.back() }}
        />
      </Screen>
    );
  }

  const handleCallPhone = (): void => {
    if (!restaurant.phone) return;
    void Linking.openURL(`tel:${restaurant.phone.replace(/\s/g, '')}`);
  };

  const handleOpenWebsite = (): void => {
    if (!restaurant.website) return;
    void Linking.openURL(restaurant.website);
  };

  const handleOpenMaps = (): void => {
    void Linking.openURL(buildMapsUrl(restaurant));
  };

  const tagsLabel = restaurant.tags.slice(0, 5).join(' · ');

  return (
    <Screen padding="none" scrollable>
      {restaurant.photoUrl ? (
        <Image
          source={{ uri: restaurant.photoUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.heroImage, styles.heroFallback]}>
          <UtensilsCrossed size={80} color={Palette.mutedLight} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerInfo}>
          <ThemedText type="title">{restaurant.name}</ThemedText>
          <View style={styles.metaRow}>
            <RatingBadge rating={restaurant.rating} />
            <PriceIndicator priceLevel={restaurant.priceLevel} size="md" />
          </View>
          {tagsLabel.length > 0 && (
            <ThemedText style={styles.tags}>{tagsLabel}</ThemedText>
          )}
        </View>

        <InfoRow icon={<MapPin size={20} color={Palette.primary} />} text={restaurant.address} />

        {restaurant.phone && (
          <ActionRow
            icon={<Phone size={20} color={Palette.primary} />}
            text={restaurant.phone}
            onPress={handleCallPhone}
            accessibilityLabel={`Appeler ${restaurant.phone}`}
          />
        )}

        {restaurant.website && (
          <ActionRow
            icon={<ExternalLink size={20} color={Palette.primary} />}
            text={restaurant.website}
            onPress={handleOpenWebsite}
            accessibilityLabel="Ouvrir le site web"
          />
        )}

        {restaurant.openingHours && restaurant.openingHours.length > 0 && (
          <View style={styles.hoursSection}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color={Palette.primary} />
              <ThemedText type="defaultSemiBold">Horaires</ThemedText>
            </View>
            {restaurant.openingHours.map((line) => (
              <ThemedText key={line} style={styles.hourLine}>
                {line}
              </ThemedText>
            ))}
          </View>
        )}

        <View style={styles.cta}>
          <Button
            label="Voir sur Maps"
            onPress={handleOpenMaps}
            icon={<MapPin size={20} color={Palette.white} />}
            fullWidth
            size="lg"
            variant="primary"
          />
        </View>
      </View>
    </Screen>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  text: string;
}

function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.row}>
      {icon}
      <ThemedText style={styles.rowText}>{text}</ThemedText>
    </View>
  );
}

interface ActionRowProps extends InfoRowProps {
  onPress: () => void;
  accessibilityLabel: string;
}

function ActionRow({ icon, text, onPress, accessibilityLabel }: ActionRowProps) {
  const linkColor = useThemeColor({ light: Palette.primary, dark: '#3b9ec9' }, 'tint');
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
      <ThemedText style={[styles.rowText, { color: linkColor }]} numberOfLines={1}>
        {text}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Palette.borderLight,
  },
  heroFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  headerInfo: {
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  tags: {
    opacity: 0.7,
    fontSize: FontSize.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rowText: {
    flex: 1,
  },
  rowPressed: {
    opacity: 0.6,
  },
  hoursSection: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  hourLine: {
    fontSize: FontSize.sm,
    opacity: 0.8,
    paddingLeft: 32,
  },
  cta: {
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
