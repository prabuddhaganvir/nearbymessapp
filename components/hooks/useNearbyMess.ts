import { useEffect, useState } from "react";
import { Mess } from "@/types/mess";

export default function useNearbyMess(
  lat: number | null,
  lng: number | null
) {
  const [data, setData] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lng == null) return;

    const fetchMess = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/getnearby?lat=${lat}&lng=${lng}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch nearby mess");
        }

        const json = (await res.json()) as Mess[]; // ✅ FIXED
        setData(json);
      } catch (err) {
        setError("Unable to load nearby mess");
        setData([]); // ✅ avoid stale data
      } finally {
        setLoading(false);
      }
    };

    fetchMess();
  }, [lat, lng]);

  return { data, loading, error };
}
