import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  CuisineFilter,
  FriendPickerGrid,
  PlaceTypeFilter,
  PriceFilter,
} from '@/src/components/event';
import { Button, Input, Screen } from '@/src/components/ui';
import { FontSize, Spacing } from '@/src/constants/theme';
import { useLocation } from '@/src/hooks/use-location';
import { useApp } from '@/src/store/app-context';
import type { FriendProfile, PlaceType, PriceLevel, UUID } from '@/src/types/models';
import { createEvent } from '@/src/utils/factories';
import { FRIEND_PRESETS, getFriendPresetById } from '@/src/utils/friend-presets';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 40;

export default function CreateEventScreen() {
  const { state, dispatch } = useApp();
  const { location } = useLocation();

  const [name, setName] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceLevel[]>([]);
  const [invitedIds, setInvitedIds] = useState<UUID[]>([]);

  const invitedSet = useMemo(() => new Set(invitedIds), [invitedIds]);
  const hasValidName = name.trim().length >= MIN_NAME_LENGTH;
  const hasInvitedFriends = invitedIds.length > 0;
  const isValid = hasValidName && hasInvitedFriends;

  const validationHint = !hasValidName
    ? 'Donne un nom à ton event.'
    : !hasInvitedFriends
      ? 'Invite au moins un ami pour démarrer.'
      : null;

  const toggleFriend = (friendId: UUID): void => {
    setInvitedIds((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId],
    );
  };

  const handleCreate = (): void => {
    if (!state.user || !isValid) return;

    const event = createEvent({
      name: name.trim(),
      hostId: state.user.id,
      location,
      placeType,
      priceLevels: prices,
      cuisineTags: cuisines,
    });

    dispatch({ type: 'EVENT_UPSERT', payload: event });

    const invitedFriends: FriendProfile[] = [];
    for (const id of invitedIds) {
      const friend = getFriendPresetById(id);
      if (friend) invitedFriends.push(friend);
    }
    dispatch({
      type: 'FRIENDS_SET',
      payload: { eventId: event.id, items: invitedFriends },
    });

    router.replace(`/event/${event.id}/lobby` as Href);
  };

  return (
    <Screen padding="lg" scrollable>
      <View style={styles.section}>
        <Input
          label="Nom de l'event"
          placeholder="Soirée copains"
          value={name}
          onChangeText={setName}
          helperText={
            name.length > 0 ? `${name.length}/${MAX_NAME_LENGTH} caractères` : undefined
          }
          maxLength={MAX_NAME_LENGTH}
          autoFocus
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Type de lieu</ThemedText>
        <PlaceTypeFilter selected={placeType} onChange={setPlaceType} />
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Cuisines préférées</ThemedText>
        <CuisineFilter selected={cuisines} onChange={setCuisines} />
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Budget</ThemedText>
        <PriceFilter selected={prices} onChange={setPrices} />
      </View>

      <View style={styles.section}>
        <ThemedText type="defaultSemiBold">Amis à inviter ({invitedIds.length})</ThemedText>
        <FriendPickerGrid
          presets={FRIEND_PRESETS}
          invitedIds={invitedSet}
          onToggle={toggleFriend}
        />
      </View>

      <View style={styles.cta}>
        <Button
          label="Créer l'event"
          onPress={handleCreate}
          disabled={!isValid}
          fullWidth
          size="lg"
        />
        {validationHint && <ThemedText style={styles.hint}>{validationHint}</ThemedText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  cta: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  hint: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: FontSize.sm,
  },
});
