import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';

import { loadSnapshot, saveSnapshot } from '@/src/services/storage';

import { reducer } from './reducer';
import { initialState, type Action, type AppState } from './types';

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        if (snapshot) dispatch({ type: 'HYDRATE', payload: snapshot });
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveSnapshot(state);
  }, [state, hydrated]);

  return (
    <AppContext.Provider value={{ state, dispatch, hydrated }}>{children}</AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
