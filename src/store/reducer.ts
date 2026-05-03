import type { Action, AppState } from './types';
import { initialState } from './types';

function assertNever(action: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(action)}`);
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SET':
      return { ...state, user: action.payload };

    case 'USER_CLEAR':
      return { ...state, user: null };

    case 'EVENT_UPSERT':
      return {
        ...state,
        events: { ...state.events, [action.payload.id]: action.payload },
      };

    case 'EVENT_REMOVE': {
      const { [action.payload]: _removed, ...rest } = state.events;
      return { ...state, events: rest };
    }

    case 'PARTICIPANTS_SET':
      return {
        ...state,
        participantsByEvent: {
          ...state.participantsByEvent,
          [action.payload.eventId]: action.payload.items,
        },
      };

    case 'PARTICIPANT_ADD': {
      const { eventId, userId } = action.payload;
      const current = state.participantsByEvent[eventId] ?? [];
      if (current.some((p) => p.userId === userId)) return state;
      return {
        ...state,
        participantsByEvent: {
          ...state.participantsByEvent,
          [eventId]: [...current, action.payload],
        },
      };
    }

    case 'FRIENDS_SET':
      return {
        ...state,
        friendsByEvent: {
          ...state.friendsByEvent,
          [action.payload.eventId]: action.payload.items,
        },
      };

    case 'FRIEND_ADD': {
      const { eventId, friend } = action.payload;
      const current = state.friendsByEvent[eventId] ?? [];
      if (current.some((f) => f.id === friend.id)) return state;
      return {
        ...state,
        friendsByEvent: {
          ...state.friendsByEvent,
          [eventId]: [...current, friend],
        },
      };
    }

    case 'FRIEND_REMOVE': {
      const { eventId, friendId } = action.payload;
      const current = state.friendsByEvent[eventId] ?? [];
      const next = current.filter((f) => f.id !== friendId);
      if (next.length === current.length) return state;
      return {
        ...state,
        friendsByEvent: { ...state.friendsByEvent, [eventId]: next },
      };
    }

    case 'SWIPES_SET':
      return {
        ...state,
        swipesByEvent: {
          ...state.swipesByEvent,
          [action.payload.eventId]: action.payload.items,
        },
      };

    case 'SWIPE_RECORD': {
      const { eventId, id } = action.payload;
      const current = state.swipesByEvent[eventId] ?? [];
      if (current.some((s) => s.id === id)) return state;
      return {
        ...state,
        swipesByEvent: {
          ...state.swipesByEvent,
          [eventId]: [...current, action.payload],
        },
      };
    }

    case 'RESTAURANTS_SET':
      return {
        ...state,
        restaurantsByEvent: {
          ...state.restaurantsByEvent,
          [action.payload.eventId]: action.payload.items,
        },
      };

    case 'MATCH_SET':
      return {
        ...state,
        matchByEvent: {
          ...state.matchByEvent,
          [action.payload.eventId]: action.payload.match,
        },
      };

    case 'STATUS_SET':
      return { ...state, status: action.payload };

    case 'ERROR_SET':
      return { ...state, status: 'error', error: action.payload };

    case 'ERROR_CLEAR':
      return { ...state, status: state.status === 'error' ? 'idle' : state.status, error: null };

    case 'RESET':
      return initialState;

    default:
      return assertNever(action);
  }
}
