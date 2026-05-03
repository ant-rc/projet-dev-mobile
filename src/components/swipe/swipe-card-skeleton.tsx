import { StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Skeleton } from '@/src/components/ui';
import { Radii, Spacing } from '@/src/constants/theme';

export function SwipeCardSkeleton() {
  const surface = useThemeColor({ light: '#ffffff', dark: '#1f1f23' }, 'background');

  return (
    <View style={[styles.card, { backgroundColor: surface }]}>
      <Skeleton style={styles.photo} borderRadius={0} />
      <View style={styles.info}>
        <Skeleton height={24} width="70%" />
        <View style={styles.metaRow}>
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} width="20%" />
        </View>
        <Skeleton height={14} width="90%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  info: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
