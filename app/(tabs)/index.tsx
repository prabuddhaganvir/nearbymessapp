import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import useUserLocation from "@/components/hooks/usePreciseLocation";
import useNearbyMess from "@/components/hooks/useNearbyMess";
import MessCard from "@/components/mess/MessCard";
import MessListSkeleton from "@/components/skeletons/MessListSkeleton";

export default function Home() {
  const { coords, locationText, loading, detectLocation } =
    useUserLocation();

  const { data: messList, loading: messLoading, error } =
    useNearbyMess(coords.lat, coords.lng);
    // TEMP: test no-mess state
// const {
//   data: messList,
//   loading: messLoading,
//   error,
// } = useNearbyMess(0, 0); // ocean coords 😄


  const [refetching, setRefetching] = useState(false);

  const locationReady = !!coords.lat && !!coords.lng;
  const isLocating = loading || refetching;
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);


  const handleDetectLocation = async () => {
    setRefetching(true);
    await detectLocation();
    setRefetching(false);
  };


useEffect(() => {
  if (!messLoading && locationReady) {
    setHasFetchedOnce(true);
  }
}, [messLoading, locationReady]);


  return (
    <View className="flex-1 mt-1 rounded-2xl p-2 bg-white">
     <Pressable
  onPress={() => Linking.openURL("https://nearbymess.vercel.app")}
  className="mx-4 my-3 rounded-xl bg-yellow-100 border border-yellow-300 p-3"
>
  <Text className="text-sm font-semibold text-yellow-900">
    📢 Mess Owners
  </Text>
  <Text className="text-xs text-yellow-800 mt-1 underline">
    Register your mess on NearByMess. Visit our official website to get listed.
  </Text>
</Pressable>

  


      {/* TITLE */}
      <Text className="text-base font-semibold text-gray-900 ml-2">
        Your current location
      </Text>

      {/* LOCATION INPUT */}
      <View className="mt-3 flex-row items-center rounded-3xl border border-gray-200 bg-gray-50 px-2 py-1">
        {isLocating ? (
          <ActivityIndicator size="small" color="#f38d07ff" />
        ) : (
          <Ionicons name="location-outline" size={22} color="#f38d07ff" />
        )}

        <TextInput
          className="ml-3 flex-1 text-gray-500"
          value={
            isLocating ? "Detecting your location…" : locationText
          }
          editable={false}
          placeholder="Detecting your location…"
          placeholderTextColor="#9ca3af"
        />

        {isLocating && (
          <View className="ml-2 rounded-full bg-green-100 px-3 py-1">
            <Text className="text-xs font-semibold text-green-700">
              Locating
            </Text>
          </View>
        )}
      </View>

      {/* CTA */}
      <Pressable
        onPress={handleDetectLocation}
        disabled={isLocating}
        className="mt-3 flex-row items-center justify-center rounded-2xl bg-orange-500 py-3 px-2"
      >
        <Ionicons name="navigate-outline" size={18} color="#fff" />
        <Text className="ml-2 font-semibold text-white">
          {isLocating ? "Detecting..." : "Refetch Location"}
        </Text>
      </Pressable>

      {/* LIST AREA */}
{/* LIST AREA */}
<View className="flex-1 pt-2">

  {/* STATE 1: LOCATION FETCHING (initial + refetch) */}
  {isLocating && (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#f58207ff" />
      <Text className="mt-3 text-gray-500">
        Fetching mess near you…
      </Text>
    </View>
  )}

  {/* STATE 2: LOCATION READY, API LOADING */}
  {!isLocating && locationReady && messLoading && (
    <MessListSkeleton />
  )}

  {/* STATE 3: NO MESS FOUND (ONLY AFTER FETCH COMPLETES) */}
  {!isLocating &&
    locationReady &&
    hasFetchedOnce &&
    !messLoading &&
    messList.length === 0 && (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl">🍽️</Text>

        <Text className="mt-4 text-lg font-semibold text-gray-800">
          Oops! No mess nearby
        </Text>

        <Text className="mt-2 text-center text-sm text-gray-500">
          We couldn’t find any mess around your current location 😕{"\n"}
          Try refreshing or check again later.
        </Text>

        <Pressable
          onPress={handleDetectLocation}
          className="mt-5 flex-row items-center rounded-full bg-green-500 px-6 py-3"
        >
          <Text className="mr-2 text-base">🔄</Text>
          <Text className="font-semibold text-white">
            Refresh location
          </Text>
        </Pressable>

        <Text className="mt-4 text-xs text-gray-400">
          More mess listings coming soon 🚀
        </Text>
      </View>
    )}

  {/* STATE 4: DATA READY */}
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
