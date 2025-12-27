import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedMess } from "@/context/SavedMessContext";
import { useUser } from "@clerk/clerk-expo";

interface Mess {
  _id: string;
  name: string;
  address: string;
  description: string;
  chargesPerMonth: number;
  foodType: string;
  imageUrl: string;
  mobileNumber: number;
  rating?: {
    average: number;
    count: number;
  };
}

export default function MessDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [mess, setMess] = useState<Mess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rating = mess?.rating ?? { average: 0, count: 0 };

  // 🔐 replace later with real auth
  const isLoggedIn = true;

  const { toggleSave, isSaved } = useSavedMess();
  const saved = isSaved(mess?._id ?? "");
  const { isLoaded, isSignedIn } = useUser();



  useEffect(() => {
  if (isLoaded && !isSignedIn) {
    // 🚫 Not logged in → never allow details page
    router.replace("/(tabs)/profile");
  }
}, [isLoaded, isSignedIn]);

  /* ---------------- FETCH MESS ---------------- */
useEffect(() => {


  // 🔒 Guard: invalid or missing id
  if (!id || typeof id !== "string") {
    // console.warn("🚫 Invalid mess id, redirecting home");
    setLoading(false);
    setMess(null);
    // setError("Redirecting to home…");
    router.replace("/(tabs)/(home)");

    return;
  }

  let isMounted = true;
  const controller = new AbortController();

  const fetchMess = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${id}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        // 🚨 API FAILURE → redirect
        throw new Error(`API_FAILED_${res.status}`);
      }

      const data = (await res.json()) as Mess;

      if (!isMounted) return;

      setMess(data);
    } catch (err: any) {
  if (err.name === "AbortError") {
    // 🔕 Silent – normal during login / fast nav
    return;
  }

  if (!isMounted) return;

  // 🧠 Detect real API failure
  const isApiFailure =
    err instanceof Error &&
    err.message.startsWith("API_FAILED");

  if (!isApiFailure) {
    // 🔕 Silent auto-heal (OAuth / stale restore case)
    router.replace("/(tabs)/(home)");
    return;
  }

  // 🔴 REAL failure (deleted mess / backend issue)
  // console.error("❌ Fetch mess error:", err);

  // setError("Redirecting to home…");
  // setMess(null);

  setTimeout(() => {
    router.replace("/(tabs)/(home)");
  }, 1000);
}
 finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchMess();

  // 🧹 Cleanup
  return () => {
    isMounted = false;
    controller.abort();
  };
}, [id]);



  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f58207" />
        <Text style={styles.subtleText}>
          Loading mess details…
        </Text>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !mess) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>
          {error || "Something went wrong"}
        </Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (

    <View>
      {/* TOP ACTIONS */}
      <View style={styles.topActions}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>

        <Pressable
          onPress={() =>
            toggleSave({
              _id: mess._id,
              name: mess.name,
              imageUrl: mess.imageUrl,
              address: mess.address,
              chargesPerMonth: mess.chargesPerMonth,
              foodType: mess.foodType,
            })
          }
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={22}
            color={saved ? "#ef4444" : "#111"}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: mess.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{mess.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#6b7280"
            />
            <Text style={styles.locationText}>
              {mess.address}
            </Text>
          </View>

          {/* ⭐ RATING */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} style={styles.starBtn}>
                <Ionicons
                  name={
                    i <= Math.round(rating.average)
                      ? "star"
                      : "star-outline"
                  }
                  size={20}
                  color={
                    i <= Math.round(rating.average)
                      ? "#facc15"
                      : "#d1d5db"
                  }
                />
              </Pressable>
            ))}

            <Text style={styles.ratingText}>
              {rating.count > 0
                ? rating.average.toFixed(1)
                : "New"}
            </Text>
          </View>

          <Text style={styles.price}>
            ₹{mess.chargesPerMonth}
            <Text style={styles.perMonth}> / month</Text>
          </Text>

          <Text style={styles.foodType}>
            🍱 Food type: {mess.foodType}
          </Text>

          <Text style={styles.description}>
            {mess.description}
          </Text>

          {/* CTA */}
          <View style={styles.ctaRow}>
            <Pressable
              onPress={() =>
                Linking.openURL(`tel:${mess.mobileNumber}`)
              }
              style={[styles.ctaBtn, styles.callBtn]}
            >
              <Ionicons
                name="call-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.ctaText}>Call</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://wa.me/91${mess.mobileNumber}`
                )
              }
              style={[styles.ctaBtn, styles.whatsappBtn]}
            >
              <Ionicons
                name="logo-whatsapp"
                size={18}
                color="#fff"
              />
              <Text style={styles.ctaText}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  /* Common */
  center: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  subtleText: {
    marginTop: 12,
    color: "#6B7280",
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorText: {
    marginTop: 12,
    textAlign: "center",
    color: "#4B5563",
  },

  /* Top actions */
  topActions: {
    position: "absolute",
    top: 56,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 20,
  },

  /* Image */
  image: {
    width: "100%",
    height: 260,
    backgroundColor: "#E5E7EB",
  },

  /* Content */
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  /* Rating */
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  starBtn: {
    padding: 4,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  /* Price */
  price: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#16A34A",
  },
  perMonth: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
  },

  foodType: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  description: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },

  /* CTA */
  ctaRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  ctaBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  callBtn: {
    backgroundColor: "#22C55E",
  },
  whatsappBtn: {
    backgroundColor: "#111827",
  },
  ctaText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
