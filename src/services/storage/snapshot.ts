import type { AppState } from '@/src/store/types';

import { getJson, removeKey, setJson } from './client';

const SNAPSHOT_KEY = 'state-snapshot';
const SNAPSHOT_VERSION = 2;

type PersistedAppState = Omit<AppState, 'status' | 'error'>;

interface PersistedSnapshot {
  version: number;
  state: PersistedAppState;
}

export async function loadSnapshot(): Promise<AppState | null> {
  const snapshot = await getJson<PersistedSnapshot>(SNAPSHOT_KEY);
  if (!snapshot || snapshot.version !== SNAPSHOT_VERSION) return null;
  return {
    ...snapshot.state,
    status: 'idle',
    error: null,
  };
}

export async function saveSnapshot(state: AppState): Promise<void> {
  const persisted: PersistedAppState = {
    user: state.user,
    events: state.events,
    participantsByEvent: state.participantsByEvent,
    friendsByEvent: state.friendsByEvent,
    swipesByEvent: state.swipesByEvent,
    restaurantsByEvent: state.restaurantsByEvent,
    matchByEvent: state.matchByEvent,
  };
  await setJson<PersistedSnapshot>(SNAPSHOT_KEY, {
    version: SNAPSHOT_VERSION,
    state: persisted,
  });
}

export async function clearSnapshot(): Promise<void> {
  await removeKey(SNAPSHOT_KEY);
}
