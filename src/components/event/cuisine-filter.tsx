import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/src/constants/theme';

import { SelectableChip } from './selectable-chip';

export const DEFAULT_CUISINE_OPTIONS = [
  'italian',
  'french',
  'japanese',
  'sushi',
  'mexican',
  'asian',
  'indian',
  'vegan',
  'burger',
  'pizza',
];

interface CuisineFilterProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  options?: string[];
}

export function CuisineFilter({
  selected,
  onChange,
  options = DEFAULT_CUISINE_OPTIONS,
}: CuisineFilterProps) {
  const toggle = (tag: string): void => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((tag) => (
        <SelectableChip
          key={tag}
          label={tag}
          selected={selected.includes(tag)}
          onPress={() => toggle(tag)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
