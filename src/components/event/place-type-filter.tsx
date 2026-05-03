import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/src/constants/theme';
import type { PlaceType } from '@/src/types/models';

import { SelectableChip } from './selectable-chip';

interface PlaceTypeOption {
  value: PlaceType;
  label: string;
}

export const PLACE_TYPE_OPTIONS: PlaceTypeOption[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar' },
  { value: 'cafe', label: 'Café' },
  { value: 'bakery', label: 'Boulangerie' },
  { value: 'night_club', label: 'Boîte de nuit' },
];

interface PlaceTypeFilterProps {
  selected: PlaceType;
  onChange: (type: PlaceType) => void;
}

export function PlaceTypeFilter({ selected, onChange }: PlaceTypeFilterProps) {
  return (
    <View style={styles.container}>
      {PLACE_TYPE_OPTIONS.map((option) => (
        <SelectableChip
          key={option.value}
          label={option.label}
          selected={selected === option.value}
          onPress={() => onChange(option.value)}
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
