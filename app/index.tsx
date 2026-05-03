import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useApp } from '@/src/store/app-context';

export default function Index() {
  const { state, hydrated } = useApp();

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (state.user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/join" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
