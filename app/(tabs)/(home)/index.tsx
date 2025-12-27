import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Linking,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePageRefresh } from "@/components/hooks/usePageRefresh";

const Index = () => {
  const {
    coords,
    locationText,
    setLocationText,
    loading,
    detectLocation,
    searchLocationByText,
  } = useUserLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [autoDetectAllowed, setAutoDetectAllowed] = useState(false);
  const shouldFetch = !!coords.lat && !!coords.lng;

  const { data: messList, loading: messLoading } =
   useNearbyMess(
    shouldFetch ? coords.lat : null,
    shouldFetch ? coords.lng : null
  );
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);


  const locationReady = !!coords.lat && !!coords.lng;
  const isLocating = loading;

  const showWelcomeBanner =
    !isLocating &&
    !messLoading &&
    !locationReady &&
    !hasFetchedOnce &&
    locationText.trim() === "";

  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(10)).current;

useEffect(() => {
  if (showWelcomeBanner) {
    const t = setTimeout(() => {
      setAutoDetectAllowed(true);
    }, 1200); // 👈 banner visible for 1.2s

    return () => clearTimeout(t);
  }
}, [showWelcomeBanner]);



  useEffect(() => {
    if (showWelcomeBanner) {
      Animated.parallel([
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(bannerTranslate, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showWelcomeBanner]);

  useEffect(() => {
    if (!messLoading && locationReady) {
      setHasFetchedOnce(true);
    }
  }, [messLoading, locationReady]);

  const canSearch = locationText.trim().length > 0;


const messages = [
  "Locating your area…",
  "Loading nearby services…",
  "Preparing results…",
  "Almost done…",
];


const [step, setStep] = useState(0);

useEffect(() => {
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  const runSequence = () => {
    messages.forEach((_, index) => {
      const t = setTimeout(() => {
        setStep(index);
      }, index * 1500); // step change speed
      timeouts.push(t);
    });

    // 🔁 restart after last + 5 sec
    const restart = setTimeout(() => {
      setStep(0);
      runSequence();
    }, messages.length * 1500 + 5000);

    timeouts.push(restart);
  };

  runSequence();

  return () => {
    timeouts.forEach(clearTimeout);
  };
}, []);

type LatestMessResponse = {
  createdAt: string | null;
  messId?: string;
  name?: string;
};


  useEffect(() => {
    const checkNewMess = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/latest`
        );
        const data = (await res.json()) as LatestMessResponse;

        // 👉 show popup if mess added in last 15 minutes
        const FIFTEEN_MIN = 15 * 60 * 1000;

        if (
          data?.createdAt &&
          Date.now() - new Date(data.createdAt).getTime() < FIFTEEN_MIN
        ) {
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 2000);
        }
      } catch (e) {
        console.log("popup error", e);
      }
    };

    checkNewMess();
  }, []);


const { refreshing, onRefresh } = usePageRefresh(async () => {
  await detectLocation();
});

  return (
    <View style={styles.container}>
      {showPopup && (
      <View style={styles.popup}>
        <Text style={styles.popupText}>
          🎉 New mess added near your area!
        </Text>
      </View>
    )}
      {/* OWNER CTA
      <Pressable
        onPress={() => Linking.openURL("https://nearbymess.vercel.app")}
        style={styles.ownerCta}
      >
        <Text style={styles.ownerTitle}>📢 Mess Owners</Text>
        <Text style={styles.ownerSubtitle}>
          Register your mess on NearByMess
        </Text>
      </Pressable> */}

      {/* SEARCH INPUT */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#f38d07" />

        <TextInput
          style={styles.input}
          value={locationText}
          onChangeText={setLocationText}
          placeholder="Enter city, Area or Landmark"
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={() => searchLocationByText(locationText)}
        />

        <Pressable onPress={detectLocation} style={styles.locateBtn}>
          <Ionicons name="locate" size={18} color="#f38d07" />
        </Pressable>
      </View>

      {/* SEARCH BUTTON */}
      <Pressable
        disabled={!canSearch}
        onPress={() => searchLocationByText(locationText)}
        style={[
          styles.searchBtn,
          { backgroundColor: canSearch ? "#18120dff" : "#f0850bff" },
        ]}
      >
        <Ionicons name="search" size={18} color="#fff" />
        <Text style={styles.searchBtnText}>Search Mess Nearby</Text>
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
                colors={["#fff", "#e87816ff"]}
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
                  Start your search now.
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
                        Explore options in other areas
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* LOADING */}
        {isLocating && (
        <View style={styles.center}>
  <ActivityIndicator size="large" color="#f58207" />
  <Text style={styles.loadingText}>
    {messages[step]}
  </Text>

</View>

        )}

        {!isLocating && locationReady && messLoading && (
          <MessListSkeleton />
        )}

        {!isLocating &&
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

        {!isLocating &&
          locationReady &&
          !messLoading &&
          messList.length > 0 && (
            <FlatList
              data={messList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <MessCard mess={item} />}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
  onRefresh={onRefresh}
            />
          )}
      </View>
      
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
  },
  ownerCta: {
    margin: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    borderColor: "#FACC15",
    borderWidth: 1,
  },
  // ownerTitle: {
  //   fontSize: 14,
  //   fontWeight: "600",
  //   color: "#92400E",
  // },
  // ownerSubtitle: {
  //   fontSize: 12,
  //   color: "#92400E",
  //   marginTop: 4,
  //   textDecorationLine: "underline",
  // },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginHorizontal: 8,
    marginTop:14,
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
    color: "#000",
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
    color: "#000",
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
   popup: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 10,
    zIndex: 9999,
  },
  popupText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
