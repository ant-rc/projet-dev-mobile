import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ParticipantAvatar } from '@/src/components/event';
import { Button, Screen } from '@/src/components/ui';
import { Spacing } from '@/src/constants/theme';
import { clearSnapshot } from '@/src/services/storage';
import { useApp } from '@/src/store/app-context';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();

  if (!state.user) return null;

  const handleReset = (): void => {
    Alert.alert(
      'Réinitialiser',
      'Tous tes events et tes données seront perdus. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            await clearSnapshot();
            dispatch({ type: 'RESET' });
            router.replace('/');
          },
        },
      ],
    );
  };

  return (
    <Screen padding="lg">
      <View style={styles.header}>
        <ParticipantAvatar
          pseudo={state.user.pseudo}
          color={state.user.avatarColor}
          size="lg"
        />
        <ThemedText type="title">{state.user.pseudo}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Button
          label="Réinitialiser l'app"
          onPress={handleReset}
          variant="danger"
          fullWidth
          size="md"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  actions: {
    gap: Spacing.md,
    marginTop: 'auto',
    paddingBottom: Spacing.xl,
  },
});
