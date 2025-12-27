import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin,
  Search,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react-native";

import useNearbyMess from "@/components/hooks/useNearbyMess";
import useUserLocation from "@/components/hooks/usePreciseLocation";
import MessCard from "@/components/mess/MessCard";
import MessListSkeleton from "@/components/skeletons/MessListSkeleton";
import { usePageRefresh } from "@/components/hooks/usePageRefresh";

export default function Index() {
  /* ---------------- LOCATION ---------------- */
  const {
    coords,
    locationText,
    setLocationText,
    loading: locating,
    detectLocation,
    searchLocationByText,
  } = useUserLocation();

  const locationReady = !!coords.lat && !!coords.lng;
  const shouldFetch = locationReady;

  /* ---------------- DATA ---------------- */
  const { data: messList, loading: messLoading } = useNearbyMess(
    shouldFetch ? coords.lat : null,
    shouldFetch ? coords.lng : null
  );

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  /* ---------------- UI STATES ---------------- */
  const [autoDetectAllowed, setAutoDetectAllowed] = useState(false);

  const showWelcomeBanner =
    !locating &&
    !messLoading &&
    !locationReady &&
    !hasFetchedOnce &&
    locationText.trim() === "";

  /* ---------------- BANNER ANIMATION ---------------- */
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!showWelcomeBanner) return;

    Animated.parallel([
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bannerTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showWelcomeBanner]);

  /* ---------------- AUTO DETECT (SAFE) ---------------- */
  useEffect(() => {
    if (!showWelcomeBanner) return;

    const t = setTimeout(() => {
      setAutoDetectAllowed(true);
    }, 1200); // banner visible first

    return () => clearTimeout(t);
  }, [showWelcomeBanner]);

  useEffect(() => {
    if (!autoDetectAllowed) return;
    detectLocation();
  }, [autoDetectAllowed, detectLocation]);

  /* ---------------- FETCH FLAG ---------------- */
  useEffect(() => {
    if (!messLoading && locationReady) {
      setHasFetchedOnce(true);
    }
  }, [messLoading, locationReady]);

  /* ---------------- LOADING TEXT ---------------- */
  const messages = [
    "Locating your area…",
    "Loading nearby services…",
    "Preparing results…",
    "Almost done…",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!locating) return;

    const i = setInterval(() => {
      setStep((p) => (p + 1) % messages.length);
    }, 1500);

    return () => clearInterval(i);
  }, [locating]);

  /* ---------------- PULL TO REFRESH ---------------- */
  const { refreshing, onRefresh } = usePageRefresh(async () => {
    await detectLocation();
  });

  /* ======================= UI ======================= */

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#f38d07" />

        <TextInput
          style={styles.input}
          value={locationText}
          onChangeText={setLocationText}
          placeholder="Enter city, area or landmark"
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={() =>
            searchLocationByText(locationText)
          }
        />

        <Pressable
          onPress={detectLocation}
          style={styles.locateBtn}
        >
          <Ionicons name="locate" size={18} color="#f38d07" />
        </Pressable>
      </View>

      {/* SEARCH BUTTON */}
      <Pressable
        disabled={!locationText.trim()}
        onPress={() => searchLocationByText(locationText)}
        style={[
          styles.searchBtn,
          {
            backgroundColor: locationText.trim()
              ? "#18120d"
              : "#f0850b",
          },
        ]}
      >
        <Ionicons name="search" size={18} color="#fff" />
        <Text style={styles.searchBtnText}>
          Search Mess Nearby
        </Text>
      </Pressable>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* WELCOME BANNER */}
        {showWelcomeBanner && (
          <Animated.View
            style={[
              styles.bannerWrapper,
              {
                opacity: bannerOpacity,
                transform: [{ translateY: bannerTranslate }],
              },
            ]}
          >
            <View style={styles.bannerCard}>
              <LinearGradient
                colors={["#fff", "#e87816"]}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerHeader}>
                  <View style={styles.bannerIcon}>
                    <UtensilsCrossed size={18} color="#fb8129" />
                  </View>
                  <Text style={styles.bannerBadge}>Hungry?</Text>
                </View>

                <Text style={styles.bannerTitle}>
                  Find your <Text style={styles.highlight}>Mess</Text>
                </Text>

                <Text style={styles.bannerDesc}>
                  Discover affordable, home-style food services nearby.
                </Text>

                <View style={styles.bannerActions}>
                  <TouchableOpacity style={styles.actionCard}>
                    <MapPin size={22} color="#60a5fa" />
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>
                        Use Current Location
                      </Text>
                      <Text style={styles.actionSub}>
                        Auto-detect messes around you
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#64748b" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCard}>
                    <Search size={22} color="#c084fc" />
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>
                        Search by City
                      </Text>
                      <Text style={styles.actionSub}>
                        Explore other areas
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* LOCATING */}
        {locating && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#f58207" />
            <Text style={styles.loadingText}>
              {messages[step]}
            </Text>
          </View>
        )}

        {/* SKELETON */}
        {!locating && locationReady && messLoading && (
          <MessListSkeleton />
        )}

        {/* EMPTY */}
        {!locating &&
          locationReady &&
          hasFetchedOnce &&
          !messLoading &&
          messList.length === 0 && (
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>
                No mess found nearby
              </Text>
            </View>
          )}

        {/* LIST */}
        {!locating &&
          locationReady &&
          !messLoading &&
          messList.length > 0 && (
            <FlatList
              data={messList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <MessCard mess={item} />
              )}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
      </View>
    </View>
  );
}

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 8,
    marginTop: 14,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#111827",
  },
  locateBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#FFEDD5",
  },
  searchBtn: {
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  bannerWrapper: {
    paddingHorizontal: 12,
  },
  bannerCard: {
    borderRadius: 30,
    overflow: "hidden",
  },
  bannerGradient: {
    padding: 20,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bannerIcon: {
    backgroundColor: "#FED7AA",
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  bannerBadge: {
    color: "#FB923C",
    fontSize: 12,
    fontWeight: "600",
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  highlight: {
    color: "#FB923C",
  },
  bannerDesc: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },
  bannerActions: {
    marginTop: 20,
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 20,
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionSub: {
    fontSize: 12,
    color: "#6B7280",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
