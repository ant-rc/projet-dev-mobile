import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'georesto:';

function fullKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(fullKey(key));
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(fullKey(key), JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(fullKey(key));
}
