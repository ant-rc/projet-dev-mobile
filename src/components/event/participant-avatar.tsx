import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/src/constants/theme';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface ParticipantAvatarProps {
  pseudo: string;
  color: string;
  size?: AvatarSize;
}

const SIZES: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 64 };

export function ParticipantAvatar({ pseudo, color, size = 'md' }: ParticipantAvatarProps) {
  const dimension = SIZES[size];
  const initial = pseudo.trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      style={[
        styles.circle,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: color,
        },
      ]}
      accessibilityLabel={`Avatar de ${pseudo}`}
    >
      <Text style={[styles.initial, { fontSize: dimension * 0.45 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: Palette.white,
    fontWeight: '700',
  },
});
