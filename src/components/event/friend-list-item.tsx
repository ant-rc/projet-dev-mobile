import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSize, Palette, Radii, Spacing } from '@/src/constants/theme';
import type { FriendProfile, UUID } from '@/src/types/models';

import { ParticipantAvatar } from './participant-avatar';

interface FriendListItemProps {
  friend: FriendProfile;
  invited?: boolean;
  onToggle?: (friendId: UUID) => void;
  style?: StyleProp<ViewStyle>;
}

export function FriendListItem({
  friend,
  invited = false,
  onToggle,
  style,
}: FriendListItemProps) {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor(
    { light: Palette.mutedLight, dark: Palette.mutedDark },
    'icon',
  );
  const surfaceColor = useThemeColor({ light: '#f4f4f5', dark: '#27272a' }, 'background');

  const tagsLabel = friend.preferences.likedTags.slice(0, 2).join(' · ') || '—';
  const interactive = onToggle !== undefined;

  const body = (
    <>
      <ParticipantAvatar pseudo={friend.pseudo} color={friend.avatarColor} size="md" />
      <View style={styles.info}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
          {friend.pseudo}
        </Text>
        <Text style={[styles.tags, { color: mutedColor }]} numberOfLines={1}>
          {tagsLabel}
        </Text>
      </View>
      {interactive && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: invited ? Palette.success : 'transparent',
              borderColor: invited ? Palette.success : Palette.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeIcon,
              { color: invited ? Palette.white : Palette.primary },
            ]}
          >
            {invited ? '✓' : '+'}
          </Text>
        </View>
      )}
    </>
  );

  const containerStyle = [styles.container, { backgroundColor: surfaceColor }, style];

  if (interactive) {
    return (
      <Pressable
        onPress={() => onToggle(friend.id)}
        style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${invited ? 'Retirer' : 'Inviter'} ${friend.pseudo}`}
        accessibilityState={{ selected: invited }}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{body}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  info: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '600' },
  tags: { fontSize: FontSize.sm },
  badge: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: FontSize.lg, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
