import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FriendListItem, ParticipantAvatar } from '@/src/components/event';
import { Button, EmptyState, Screen } from '@/src/components/ui';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';
import { useApp } from '@/src/store/app-context';
import { selectEventById, selectFriends } from '@/src/store/selectors';
import type { Event, UUID } from '@/src/types/models';

export default function LobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();

  const eventId = id as UUID;
  const event = selectEventById(state, eventId);
  const friends = selectFriends(state, eventId);
  const user = state.user;

  if (!event || !user) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Event introuvable"
          description="Cet event n'existe plus ou a été supprimé."
          action={{ label: 'Retour', onPress: () => router.replace('/(tabs)') }}
        />
      </Screen>
    );
  }

  const totalParticipants = friends.length + 1;

  const handleStart = (): void => {
    const updated: Event = { ...event, status: 'swiping' };
    dispatch({ type: 'EVENT_UPSERT', payload: updated });
    router.push(`/event/${event.id}/swipe` as Href);
  };

  return (
    <Screen padding="lg" scrollable>
      <View style={styles.header}>
        <ThemedText type="title">{event.name}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}
        </ThemedText>
      </View>

      <View style={styles.participantsList}>
        <UserCard pseudo={user.pseudo} color={user.avatarColor} />
        {friends.map((friend) => (
          <FriendListItem key={friend.id} friend={friend} />
        ))}
      </View>

      <View style={styles.cta}>
        <Button
          label="Démarrer le swipe"
          onPress={handleStart}
          disabled={friends.length === 0}
          fullWidth
          size="lg"
        />
        {friends.length === 0 && (
          <ThemedText style={styles.helper}>
            Invite au moins un ami pour démarrer.
          </ThemedText>
        )}
      </View>
    </Screen>
  );
}

interface UserCardProps {
  pseudo: string;
  color: string;
}

function UserCard({ pseudo, color }: UserCardProps) {
  const surfaceColor = useThemeColor({ light: '#f4f4f5', dark: '#27272a' }, 'background');
  const mutedColor = useThemeColor(
    { light: Palette.mutedLight, dark: Palette.mutedDark },
    'icon',
  );

  return (
    <View style={[styles.userCard, { backgroundColor: surfaceColor }]}>
      <ParticipantAvatar pseudo={pseudo} color={color} size="md" />
      <View style={styles.userInfo}>
        <ThemedText type="defaultSemiBold">{pseudo}</ThemedText>
        <ThemedText style={[styles.host, { color: mutedColor }]}>Hôte (toi)</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
  },
  participantsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.md,
  },
  userInfo: { flex: 1 },
  host: { fontSize: FontSize.sm },
  cta: {
    marginTop: 'auto',
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  helper: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: FontSize.sm,
  },
});
