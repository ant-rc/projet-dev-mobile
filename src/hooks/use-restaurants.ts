import { useCallback, useEffect, useState } from 'react';

import { searchNearby } from '@/src/services/places';
import { useApp } from '@/src/store/app-context';
import { selectEventById, selectRestaurants } from '@/src/store/selectors';
import type { Restaurant, UUID } from '@/src/types/models';

interface CancelSignal {
  cancelled: boolean;
}

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRestaurants(eventId: UUID): UseRestaurantsResult {
  const { state, dispatch } = useApp();
  const event = selectEventById(state, eventId);
  const restaurants = selectRestaurants(state, eventId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = useCallback(
    async (signal: CancelSignal): Promise<void> => {
      if (!event) return;
      setLoading(true);
      setError(null);
      try {
        const items = await searchNearby({
          lat: event.filters.location.lat,
          lng: event.filters.location.lng,
          radiusMeters: event.filters.location.radiusMeters,
          priceLevels:
            event.filters.priceLevels.length > 0 ? event.filters.priceLevels : undefined,
        });
        if (signal.cancelled) return;
        dispatch({ type: 'RESTAURANTS_SET', payload: { eventId, items } });
      } catch (err) {
        if (signal.cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!signal.cancelled) setLoading(false);
      }
    },
    [event, eventId, dispatch],
  );

  const refetch = useCallback(async (): Promise<void> => {
    await doFetch({ cancelled: false });
  }, [doFetch]);

  useEffect(() => {
    if (!event) return;
    if (restaurants.length > 0) return;
    const signal: CancelSignal = { cancelled: false };
    void doFetch(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [event, restaurants.length, doFetch]);

  return { restaurants, loading, error, refetch };
}
