import { Stack } from 'expo-router';

export default function EventLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ title: 'Nouvel event' }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
