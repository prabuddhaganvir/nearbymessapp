import { useRef, useState } from "react";
import * as Location from "expo-location";

interface Coordinates {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

const MAX_WAIT_TIME = 12000; // 12s hard timeout
const TARGET_ACCURACY = 20; // meters

export default function useUserLocation() {
  const [coords, setCoords] = useState<Coordinates>({
    lat: null,
    lng: null,
    accuracy: null,
  });

  const [locationText, setLocationText] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFetchingRef = useRef(false);

  /* 📍 GPS BASED LOCATION */
  const detectLocation = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setPermissionDenied(false);
    setLocationText("Getting precise location...");

    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setPermissionDenied(true);
        setLocationText("Location permission denied");
        return;
      }

      const startTime = Date.now();
      let bestLocation: Location.LocationObject | null = null;

      while (Date.now() - startTime < MAX_WAIT_TIME) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        if (
          location.coords.accuracy !== null &&
          (bestLocation === null ||
            location.coords.accuracy <
              (bestLocation.coords.accuracy ?? Infinity))
        ) {
          bestLocation = location;
        }

        if (
          location.coords.accuracy !== null &&
          location.coords.accuracy <= TARGET_ACCURACY
        ) {
          break;
        }
      }

      if (!bestLocation) {
        throw new Error("Unable to get precise location");
      }

      const { latitude, longitude, accuracy } = bestLocation.coords;

      setCoords({
        lat: latitude,
        lng: longitude,
        accuracy: accuracy ?? null,
      });

      const address = await Location.reverseGeocodeAsync({
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

        setLocationText(place || "Location detected");
      } else {
        setLocationText("Location detected");
      }
    } catch {
      setLocationText("Unable to detect precise location. Retry.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  /* 🔍 TEXT → COORDINATES (Mumbai, Pune, etc.) */
  const searchLocationByText = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setPermissionDenied(false);

      const results = await Location.geocodeAsync(query);

      if (results.length === 0) {
        setLocationText("Location not found");
        return;
      }

      const { latitude, longitude } = results[0];

      setCoords({
        lat: latitude,
        lng: longitude,
        accuracy: null,
      });
    } catch {
      setLocationText("Unable to find location");
    } finally {
      setLoading(false);
    }
  };

  return {
    coords,
    locationText,
    setLocationText,
    permissionDenied,
    loading,
    detectLocation,        // 📍 GPS button
    searchLocationByText,  // 🔍 Manual search
  };
}
