import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/src/constants/theme';
import type { FriendProfile, UUID } from '@/src/types/models';

import { FriendListItem } from './friend-list-item';

interface FriendPickerGridProps {
  presets: FriendProfile[];
  invitedIds: ReadonlySet<UUID>;
  onToggle: (friendId: UUID) => void;
}

export function FriendPickerGrid({ presets, invitedIds, onToggle }: FriendPickerGridProps) {
  return (
    <View style={styles.list}>
      {presets.map((friend) => (
        <FriendListItem
          key={friend.id}
          friend={friend}
          invited={invitedIds.has(friend.id)}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm },
});
