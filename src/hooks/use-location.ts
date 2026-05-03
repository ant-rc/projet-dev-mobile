import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

import type { GeoPoint } from '@/src/types/models';

const PARIS_FALLBACK: GeoPoint = { lat: 48.8566, lng: 2.3522 };

interface UseLocationResult {
  location: GeoPoint;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<void>;
}

async function fetchCurrentPosition(): Promise<GeoPoint> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<GeoPoint>(PARIS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        setError('Permission de localisation refusée');
        return;
      }
      setPermissionGranted(true);
      const point = await fetchCurrentPosition();
      setLocation(point);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        if (status !== 'granted') {
          setLoading(false);
          return;
        }
        setPermissionGranted(true);
        const point = await fetchCurrentPosition();
        if (cancelled) return;
        setLocation(point);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { location, loading, error, permissionGranted, requestPermission };
}
