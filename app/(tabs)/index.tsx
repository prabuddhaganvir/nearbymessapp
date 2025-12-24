import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Search, ChevronRight, UtensilsCrossed } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import useNearbyMess from "@/components/hooks/useNearbyMess";
import MessCard from "@/components/mess/MessCard";
import MessListSkeleton from "@/components/skeletons/MessListSkeleton";
import useUserLocation from "@/components/hooks/usePreciseLocation";

export default function Index() {
  const {
    coords,
    locationText,
    setLocationText,
    loading,
    detectLocation,
    searchLocationByText,
  } = useUserLocation();

  const { data: messList, loading: messLoading } =
    useNearbyMess(coords.lat, coords.lng);

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const locationReady = !!coords.lat && !!coords.lng;
  const isLocating = loading;

  /* 🔔 Welcome banner condition */
  const showWelcomeBanner =
    !isLocating &&
    !messLoading &&
    !locationReady &&
    !hasFetchedOnce &&
    locationText.trim() === "";

  /* 🎬 Banner animation */
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslate = useRef(new Animated.Value(10)).current;

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

  return (
    <View className="flex-1 bg-white px-2 pt-2">
      {/* OWNER CTA */}
      <Pressable
        onPress={() => Linking.openURL("https://nearbymess.vercel.app")}
        className="mx-3 my-3 rounded-xl border border-yellow-300 bg-yellow-100 p-3"
      >
        <Text className="text-sm font-semibold text-yellow-900">
          📢 Mess Owners
        </Text>
        <Text className="mt-1 text-xs text-yellow-800 underline">
          Register your mess on NearByMess
        </Text>
      </Pressable>

      {/* SEARCH INPUT */}
      <View className="mx-2 mt-2 flex-row items-center rounded-3xl border border-gray-200 bg-gray-50 px-3 py-2">
        <Ionicons name="search-outline" size={20} color="#f38d07ff" />

        <TextInput
          className="ml-3 flex-1 text-gray-800"
          value={locationText}
          onChangeText={setLocationText}
          placeholder="Enter city, area or landmark"
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={() =>
            searchLocationByText(locationText)
          }
        />

        {/* AUTO DETECT */}
        <Pressable
          onPress={detectLocation}
          className="ml-2 rounded-full bg-orange-100 p-2"
        >
          <Ionicons name="locate" size={18} color="#f38d07ff" />
        </Pressable>
      </View>

      {/* SEARCH BUTTON */}
      <Pressable
        disabled={!canSearch}
        onPress={() => searchLocationByText(locationText)}
        className={`mx-2 mt-3 flex-row items-center justify-center rounded-2xl py-3 ${
          canSearch ? "bg-black" : "bg-gray-400"
        }`}
      >
        <Ionicons name="search" size={18} color="#ffffffff" />
        <Text className="ml-2 text-base font-semibold text-white">
          Search Mess Nearby
        </Text>
      </Pressable>

      {/* LIST / STATES */}
      <View className="flex-1 pt-3">
        {/* 🎉 WELCOME BANNER (UI UNCHANGED) */}
      {showWelcomeBanner && (
  <Animated.View
    style={{
      opacity: bannerOpacity,
      transform: [{ translateY: bannerTranslate }],
    }}
    className="flex-1 items-center justify-center px-4"
  >
    {/* Container with Gradient & Border */}
    <View className="w-full overflow-hidden rounded-[30px] border border-white/10 shadow-sm shadow-orange-600">
      <LinearGradient
        // Deep modern dark theme: Slate 900 to nearly black
        colors={['#ffffffff', '#ffffffff']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6"
      >
        {/* Header Section */}
        <View className="flex-row items-start justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-orange-500/20 p-2 rounded-full">
                <UtensilsCrossed size={18} color="#fb8129ff" />
              </View>
              <Text className="text-orange-400 font-semibold tracking-wider text-xs uppercase">
                Hungry?
              </Text>
            </View>
            <Text className="text-3xl font-bold text-black leading-tight">
              Find your <Text className="text-orange-500">Mess</Text>
            </Text>
          </View>
        </View>

        <Text className="mt-3 text-base font-medium text-slate-400 leading-6">
          Discover affordable, home-style food services nearby. 
          Start your search now.
        </Text>

        {/* Action Cards / Pills */}
        <View className="mt-8 gap-3">
          
          {/* Action 1: Auto Detect */}
          <TouchableOpacity className="flex-row items-center bg-white/5 border border-white/5 p-4 rounded-2xl active:bg-white/10">
            <View className="bg-blue-500/20 p-2.5 rounded-xl mr-4">
              <MapPin size={22} color="#60a5fa" />
            </View>
            <View className="flex-1">
              <Text className="text-black font-semibold text-base">
                Use Current Location
              </Text>
              <Text className="text-slate-500 text-xs">
                Auto-detect best messes around you
              </Text>
            </View>
            <ChevronRight size={20} color="#475569" />
          </TouchableOpacity>

          {/* Action 2: Manual Search */}
          <TouchableOpacity className="flex-row items-center bg-white/5 border border-white/5 p-4 rounded-2xl active:bg-white/10">
            <View className="bg-purple-500/20 p-2.5 rounded-xl mr-4">
              <Search size={22} color="#c084fc" />
            </View>
            <View className="flex-1">
              <Text className="black font-semibold text-base">
                Search by City
              </Text>
              <Text className="text-slate-500 text-xs">
                Explore options in other areas
              </Text>
            </View>
            <ChevronRight size={20} color="#475569" />
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </View>
  </Animated.View>
)}

        {/* LOCATING */}
        {isLocating && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f58207ff" />
            <Text className="mt-3 text-gray-500">
              Fetching mess near you…
            </Text>
          </View>
        )}

        {/* API LOADING */}
        {!isLocating && locationReady && messLoading && (
          <MessListSkeleton />
        )}

        {/* NO MESS */}
        {!isLocating &&
          locationReady &&
          hasFetchedOnce &&
          !messLoading &&
          messList.length === 0 && (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-5xl">🍽️</Text>
              <Text className="mt-4 text-lg font-semibold text-gray-800">
                No mess found nearby
              </Text>

              <Pressable
                onPress={detectLocation}
                className="mt-5 rounded-full bg-green-500 px-6 py-3"
              >
                <Text className="font-semibold text-white">
                  Refresh location
                </Text>
              </Pressable>
            </View>
          )}

        {/* DATA */}
        {!isLocating &&
          locationReady &&
          !messLoading &&
          messList.length > 0 && (
            <FlatList
              data={messList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <MessCard mess={item} />}
              showsVerticalScrollIndicator={false}
            />
          )}
      </View>
    </View>
  );
}
