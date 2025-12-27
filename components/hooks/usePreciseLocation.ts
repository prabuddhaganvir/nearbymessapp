import { useCallback, useRef, useState } from "react";
import * as Location from "expo-location";

/* ---------------- TYPES ---------------- */

export interface Coordinates {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

type LocationState = {
  coords: Coordinates;
  locationText: string;
  permissionDenied: boolean;
  loading: boolean;
};

/* ---------------- CONSTANTS ---------------- */

const INITIAL_COORDS: Coordinates = {
  lat: null,
  lng: null,
  accuracy: null,
};

/* ---------------- HOOK ---------------- */

export default function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    coords: INITIAL_COORDS,
    locationText: "",
    permissionDenied: false,
    loading: false,
  });

  const fetchingRef = useRef(false);

  const updateState = (patch: Partial<LocationState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  /* ----------- GPS LOCATION ----------- */

  const detectLocation = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    updateState({ loading: true, permissionDenied: false });

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        updateState({
          permissionDenied: true,
          locationText: "Location permission denied",
        });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      updateState({
        coords: {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? null,
        },
      });

      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const place =
        geo[0]?.subregion || geo[0]?.city || "Location detected";

      updateState({ locationText: place });
    } catch {
      updateState({ locationText: "Unable to detect location" });
    } finally {
      updateState({ loading: false });
      fetchingRef.current = false;
    }
  }, []);

  /* ----------- TEXT SEARCH ----------- */

  const searchLocationByText = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      updateState({ loading: true });

      try {
        const res = await Location.geocodeAsync(query);
        if (!res.length) {
          updateState({ locationText: "Location not found" });
          return;
        }

        updateState({
          coords: {
            lat: res[0].latitude,
            lng: res[0].longitude,
            accuracy: null,
          },
          locationText: query,
        });
      } catch {
        updateState({ locationText: "Unable to find location" });
      } finally {
        updateState({ loading: false });
      }
    },
    []
  );

  return {
    coords: state.coords,
    locationText: state.locationText,
    setLocationText: (t: string) =>
      updateState({ locationText: t }),
    permissionDenied: state.permissionDenied,
    loading: state.loading,
    detectLocation,
    searchLocationByText,
  };
}
