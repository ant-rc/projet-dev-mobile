import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, PartyPopper } from 'lucide-react-native';
import { useEffect } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RestaurantCard } from '@/src/components/restaurant';
import { Button, EmptyState, Screen } from '@/src/components/ui';
import { Palette, Spacing } from '@/src/constants/theme';
import { useHaptics } from '@/src/hooks/use-haptics';
import { useApp } from '@/src/store/app-context';
import {
  selectEventById,
  selectMatch,
  selectRestaurants,
} from '@/src/store/selectors';
import type { UUID } from '@/src/types/models';
import { buildMapsUrl } from '@/src/utils/maps';

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const { success } = useHaptics();

  const eventId = id as UUID;
  const event = selectEventById(state, eventId);
  const match = selectMatch(state, eventId);
  const restaurants = selectRestaurants(state, eventId);

  useEffect(() => {
    if (match) success();
  }, [match, success]);

  if (!event || !match) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Pas de match"
          description="Aucun match trouvé pour cet event."
          action={{ label: 'Retour', onPress: () => router.replace('/(tabs)') }}
        />
      </Screen>
    );
  }

  const restaurant = restaurants.find((r) => r.id === match.restaurantId);

  if (!restaurant) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Restaurant introuvable"
          description="Le restaurant matché n'est plus en cache."
          action={{ label: 'Retour', onPress: () => router.replace('/(tabs)') }}
        />
      </Screen>
    );
  }

  const handleOpenMaps = (): void => {
    void Linking.openURL(buildMapsUrl(restaurant));
  };

  const handleBack = (): void => {
    router.replace('/(tabs)');
  };

  return (
    <Screen padding="lg" scrollable>
      <View style={styles.header}>
        <PartyPopper size={48} color={Palette.success} />
        <ThemedText type="title" style={styles.title}>
          Match trouvé !
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Tout le monde a liké {restaurant.name}.
        </ThemedText>
      </View>

      <View style={styles.cardWrapper}>
        <RestaurantCard restaurant={restaurant} />
      </View>

      <View style={styles.actions}>
        <Button
          label="Voir sur Maps"
          onPress={handleOpenMaps}
          icon={<MapPin size={20} color={Palette.white} />}
          fullWidth
          size="lg"
          variant="primary"
        />
        <Button
          label="Retour aux events"
          onPress={handleBack}
          fullWidth
          size="md"
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  cardWrapper: {
    marginBottom: Spacing.xl,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: 'auto',
    paddingBottom: Spacing.xl,
  },
});
