import { useCallback, useEffect, useRef, useState } from "react";
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
const [autoDetectAllowed, setAutoDetectAllowed] = useState(false);


/* ---------------- HOOK ---------------- */

export default function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    coords: INITIAL_COORDS,
    locationText: "",
    permissionDenied: false,
    loading: false,
  });

  const fetchingRef = useRef(false);

  /* ---------------- HELPERS ---------------- */

  const updateState = useCallback(
    (patch: Partial<LocationState>) => {
      setState(prev => ({ ...prev, ...patch }));
    },
    []
  );

  /* ---------------- GPS LOCATION ---------------- */

  const detectLocation = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    updateState({
      loading: true,
      permissionDenied: false,
      locationText: "Getting precise location...",
    });

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

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const { latitude, longitude, accuracy } = location.coords;

      const coords: Coordinates = {
        lat: latitude,
        lng: longitude,
        accuracy: accuracy ?? null,
      };

      updateState({ coords });

      const address =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      if (address.length > 0) {
        const place = [
          address[0].subregion,
          address[0].city,
        ]
          .filter(Boolean)
          .join(", ");

        updateState({
          locationText: place || "Location detected",
        });
      } else {
        updateState({ locationText: "Location detected" });
      }
    } catch (error) {
      console.error("Location error:", error);
      updateState({
        locationText: "Unable to detect location",
      });
    } finally {
      updateState({ loading: false });
      fetchingRef.current = false;
    }
  }, [updateState]);

  /* ---------------- TEXT SEARCH ---------------- */

  const searchLocationByText = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      updateState({ loading: true, permissionDenied: false });

      try {
        const results = await Location.geocodeAsync(query);

        if (!results.length) {
          updateState({
            locationText: "Location not found",
          });
          return;
        }

        updateState({
          coords: {
            lat: results[0].latitude,
            lng: results[0].longitude,
            accuracy: null,
          },
          locationText: query,
        });
      } catch (error) {
        console.error("Geocode error:", error);
        updateState({
          locationText: "Unable to find location",
        });
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState]
  );

  /* ---------------- AUTO DETECT ON MOUNT ---------------- */

useEffect(() => {
  if (!autoDetectAllowed) return;

  detectLocation();
}, [autoDetectAllowed, detectLocation]);


  /* ---------------- RETURN ---------------- */

  return {
    coords: state.coords,
    locationText: state.locationText,
    setLocationText: (text: string) =>
      updateState({ locationText: text }),
    permissionDenied: state.permissionDenied,
    loading: state.loading,
    detectLocation,
    searchLocationByText,
    isReady:
      state.coords.lat !== null &&
      state.coords.lng !== null,
  };
}
