import { Stack } from 'expo-router';

export default function EventIdLayout() {
  return (
    <Stack>
      <Stack.Screen name="lobby" options={{ title: 'Lobby' }} />
      <Stack.Screen name="swipe" options={{ headerShown: false }} />
      <Stack.Screen name="match" options={{ presentation: 'modal', title: 'Match !' }} />
    </Stack>
  );
}
