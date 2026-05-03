import { router, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button, EmptyState, Screen } from '@/src/components/ui';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';
import { useApp } from '@/src/store/app-context';
import { selectAllEvents, selectFriends } from '@/src/store/selectors';
import type { Event, UUID } from '@/src/types/models';

const STATUS_LABEL: Record<Event['status'], string> = {
  lobby: 'En attente',
  swiping: 'Swipe en cours',
  matched: 'Match trouvé',
  cancelled: 'Annulé',
};

export default function EventsScreen() {
  const { state } = useApp();
  const events = selectAllEvents(state);

  const handleCreate = (): void => {
    router.push('/event/create' as Href);
  };

  const handleOpenEvent = (eventId: UUID): void => {
    router.push(`/event/${eventId}/lobby` as Href);
  };

  if (events.length === 0) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Aucun event"
          description="Crée ton premier event pour trouver un resto avec tes amis."
          action={{ label: '+ Créer un event', onPress: handleCreate }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding="lg" scrollable>
      <View style={styles.header}>
        <ThemedText type="title">Mes events</ThemedText>
        <Button label="+ Nouveau" onPress={handleCreate} size="sm" />
      </View>
      <View style={styles.list}>
        {events.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            friendsCount={selectFriends(state, event.id).length}
            onPress={() => handleOpenEvent(event.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

interface EventListItemProps {
  event: Event;
  friendsCount: number;
  onPress: () => void;
}

function EventListItem({ event, friendsCount, onPress }: EventListItemProps) {
  const surfaceColor = useThemeColor({ light: '#f4f4f5', dark: '#27272a' }, 'background');
  const mutedColor = useThemeColor(
    { light: Palette.mutedLight, dark: Palette.mutedDark },
    'icon',
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: surfaceColor },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir l'event ${event.name}`}
    >
      <View style={styles.itemInfo}>
        <ThemedText type="defaultSemiBold">{event.name}</ThemedText>
        <ThemedText style={[styles.itemMeta, { color: mutedColor }]}>
          {friendsCount} ami{friendsCount > 1 ? 's' : ''} · {STATUS_LABEL[event.status]}
        </ThemedText>
      </View>
      <ChevronRight size={20} color={mutedColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  list: { gap: Spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radii.md,
    gap: Spacing.md,
  },
  itemInfo: { flex: 1, gap: Spacing.xs },
  itemMeta: { fontSize: FontSize.sm },
  pressed: { opacity: 0.7 },
});
