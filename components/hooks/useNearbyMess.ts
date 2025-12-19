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
    if (!lat || !lng) return;

    const fetchMess = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/getnearby?lat=${lat}&lng=${lng}`
        );

        const json = await res.json();
        setData(json); // 👈 API directly returns array
      } catch {
        setError("Unable to load nearby mess");
      } finally {
        setLoading(false);
      }
    };

    fetchMess();
  }, [lat, lng]);

  return { data, loading, error };
}
