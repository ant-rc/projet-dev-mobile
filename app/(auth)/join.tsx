import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Input, Screen } from '@/src/components/ui';
import { Spacing } from '@/src/constants/theme';
import { useApp } from '@/src/store/app-context';
import { createUser } from '@/src/utils/factories';

const MIN_LENGTH = 2;
const MAX_LENGTH = 20;

export default function JoinScreen() {
  const { dispatch } = useApp();
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const trimmed = pseudo.trim();
  const isValid = trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;

  const handleSubmit = (): void => {
    if (!isValid) {
      setError(`Le pseudo doit faire entre ${MIN_LENGTH} et ${MAX_LENGTH} caractères`);
      return;
    }
    setError(null);
    const user = createUser(trimmed);
    dispatch({ type: 'USER_SET', payload: user });
    router.replace('/(tabs)');
  };

  return (
    <Screen padding="lg">
      <View style={styles.content}>
        <View style={styles.hero}>
          <ThemedText type="title">GeoResto</ThemedText>
          <ThemedText style={styles.tagline}>
            Trouvez le restaurant parfait avec vos amis, en swipant.
          </ThemedText>
        </View>

        <Input
          label="Ton pseudo"
          placeholder="Ton prénom"
          value={pseudo}
          onChangeText={(text) => {
            setPseudo(text);
            if (error) setError(null);
          }}
          error={error ?? undefined}
          maxLength={MAX_LENGTH}
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Button
          label="Continuer"
          onPress={handleSubmit}
          disabled={!isValid}
          fullWidth
          size="lg"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: Spacing.xl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
