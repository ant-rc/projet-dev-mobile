import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SwipeActions, SwipeStack } from '@/src/components/swipe';
import { EmptyState, Screen } from '@/src/components/ui';
import { Spacing } from '@/src/constants/theme';
import { useRestaurants } from '@/src/hooks/use-restaurants';
import { useSwipeAction } from '@/src/hooks/use-swipe-action';
import { useApp } from '@/src/store/app-context';
import {
  selectEventById,
  selectMatch,
  selectRestaurantsToSwipe,
} from '@/src/store/selectors';
import type { SwipeDirection, UUID } from '@/src/types/models';

export default function SwipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();

  const eventId = id as UUID;
  const event = selectEventById(state, eventId);
  const user = state.user;
  const existingMatch = selectMatch(state, eventId);

  const { restaurants, loading, error, refetch } = useRestaurants(eventId);
  const { swipe } = useSwipeAction(eventId);

  const remaining = useMemo(
    () => (user ? selectRestaurantsToSwipe(state, eventId, user.id) : []),
    [state, eventId, user],
  );

  useEffect(() => {
    if (existingMatch) {
      router.replace(`/event/${eventId}/match` as Href);
    }
  }, [existingMatch, eventId]);

  if (!event || !user) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Event introuvable"
          description="Retour à la liste."
          action={{ label: 'Retour', onPress: () => router.replace('/(tabs)') }}
        />
      </Screen>
    );
  }

  const topRestaurant = remaining[0];

  const handleSwipe = (restaurantId: string, direction: SwipeDirection): void => {
    const match = swipe(restaurantId, direction);
    if (match) {
      router.replace(`/event/${eventId}/match` as Href);
    }
  };

  const handleInfoPress = (restaurantId: string): void => {
    router.push(`/restaurant/${restaurantId}` as Href);
  };

  if (loading && restaurants.length === 0) {
    return (
      <Screen padding="lg">
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.muted}>Recherche des restaurants…</ThemedText>
        </View>
      </Screen>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Erreur"
          description={error}
          action={{ label: 'Réessayer', onPress: () => void refetch() }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding="lg">
      <View style={styles.header}>
        <ThemedText type="title" numberOfLines={1}>
          {event.name}
        </ThemedText>
        <ThemedText style={styles.muted}>
          {remaining.length} restaurant{remaining.length > 1 ? 's' : ''} restant
          {remaining.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      <View style={styles.stackContainer}>
        <SwipeStack
          restaurants={remaining}
          onSwipe={handleSwipe}
          onInfoPress={handleInfoPress}
          emptyTitle="Plus de restaurants"
          emptyDescription="Tu as tout swipé pour cet event."
        />
      </View>

      <SwipeActions
        onLike={() => topRestaurant && handleSwipe(topRestaurant.id, 'like')}
        onSkip={() => topRestaurant && handleSwipe(topRestaurant.id, 'skip')}
        disabled={!topRestaurant}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  muted: {
    opacity: 0.7,
  },
  stackContainer: {
    flex: 1,
    marginVertical: Spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
});
