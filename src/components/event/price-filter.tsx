import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/src/constants/theme';
import type { PriceLevel } from '@/src/types/models';

import { SelectableChip } from './selectable-chip';

const ALL_LEVELS: PriceLevel[] = [1, 2, 3, 4];

interface PriceFilterProps {
  selected: PriceLevel[];
  onChange: (levels: PriceLevel[]) => void;
}

export function PriceFilter({ selected, onChange }: PriceFilterProps) {
  const toggle = (level: PriceLevel): void => {
    if (selected.includes(level)) {
      onChange(selected.filter((l) => l !== level));
    } else {
      onChange([...selected, level].sort((a, b) => a - b));
    }
  };

  return (
    <View style={styles.container}>
      {ALL_LEVELS.map((level) => (
        <SelectableChip
          key={level}
          label={'€'.repeat(level)}
          selected={selected.includes(level)}
          onPress={() => toggle(level)}
          accessibilityLabel={`Niveau de prix ${level}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
