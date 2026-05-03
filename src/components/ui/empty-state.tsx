import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontSize, Spacing } from '@/src/constants/theme';

import { Button } from './button';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={styles.description}>{description}</ThemedText>
      )}
      {action && (
        <Button label={action.label} onPress={action.onPress} variant="primary" size="md" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
  },
  title: { textAlign: 'center' },
  description: { textAlign: 'center', fontSize: FontSize.md, opacity: 0.7 },
});
