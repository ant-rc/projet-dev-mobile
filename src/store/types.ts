import type {
  Event,
  Match,
  Participant,
  Restaurant,
  Swipe,
  User,
  UUID,
} from '@/src/types/models';

export type AppStatus = 'idle' | 'loading' | 'error';

export interface AppState {
  user: User | null;
  events: Record<UUID, Event>;
  participantsByEvent: Record<UUID, Participant[]>;
  swipesByEvent: Record<UUID, Swipe[]>;
  restaurantsByEvent: Record<UUID, Restaurant[]>;
  matchByEvent: Record<UUID, Match | null>;
  status: AppStatus;
  error: string | null;
}

export type Action =
  | { type: 'USER_SET'; payload: User }
  | { type: 'USER_CLEAR' }
  | { type: 'EVENT_UPSERT'; payload: Event }
  | { type: 'EVENT_REMOVE'; payload: UUID }
  | { type: 'PARTICIPANTS_SET'; payload: { eventId: UUID; items: Participant[] } }
  | { type: 'PARTICIPANT_ADD'; payload: Participant }
  | { type: 'SWIPES_SET'; payload: { eventId: UUID; items: Swipe[] } }
  | { type: 'SWIPE_RECORD'; payload: Swipe }
  | { type: 'RESTAURANTS_SET'; payload: { eventId: UUID; items: Restaurant[] } }
  | { type: 'MATCH_SET'; payload: { eventId: UUID; match: Match } }
  | { type: 'STATUS_SET'; payload: AppStatus }
  | { type: 'ERROR_SET'; payload: string }
  | { type: 'ERROR_CLEAR' }
  | { type: 'RESET' };

export const initialState: AppState = {
  user: null,
  events: {},
  participantsByEvent: {},
  swipesByEvent: {},
  restaurantsByEvent: {},
  matchByEvent: {},
  status: 'idle',
  error: null,
};
