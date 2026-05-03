import { router, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ListRenderItem } from 'react-native';

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

  const handleCreate = useCallback((): void => {
    router.push('/event/create' as Href);
  }, []);

  const handleOpenEvent = useCallback((eventId: UUID): void => {
    router.push(`/event/${eventId}/lobby` as Href);
  }, []);

  const renderItem: ListRenderItem<Event> = useCallback(
    ({ item }) => (
      <EventListItem
        event={item}
        friendsCount={selectFriends(state, item.id).length}
        onPress={() => handleOpenEvent(item.id)}
      />
    ),
    [state, handleOpenEvent],
  );

  const keyExtractor = useCallback((item: Event): string => item.id, []);

  return (
    <Screen padding="none">
      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={
          events.length > 0 ? (
            <View style={styles.header}>
              <ThemedText type="title">Mes events</ThemedText>
              <Button label="+ Nouveau" onPress={handleCreate} size="sm" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="Aucun event"
            description="Crée ton premier event pour trouver un resto avec tes amis."
            action={{ label: '+ Créer un event', onPress: handleCreate }}
          />
        }
      />
    </Screen>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
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
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  separator: { height: Spacing.sm },
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
