import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedMess } from "@/context/SavedMessContext";



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
  const [userSelectedRating, setUserSelectedRating] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hasRated, setHasRated] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const rating = mess?.rating ?? { average: 0, count: 0 };
const displayRating =
  userSelectedRating !== null
    ? userSelectedRating
    : rating.average;
    




  // 🔐 replace later with real auth
  const isLoggedIn = true;

  const { toggleSave, isSaved } = useSavedMess();
  const saved = isSaved(mess?._id ?? "");

  /* ---------------- FETCH MESS ---------------- */
  useEffect(() => {
    const fetchMess = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${id}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setMess(data);
      } catch {
        setError("Unable to load mess details 😕");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMess();
  }, [id]);




  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f58207ff" />
        <Text className="mt-3 text-gray-500">
          Loading mess details…
        </Text>
      </View>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !mess) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-5xl">⚠️</Text>
        <Text className="mt-3 text-center text-gray-600">
          {error || "Something went wrong"}
        </Text>
      </View>
    );
  }

  

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* TOP ACTIONS */}
      <View className="absolute top-14 left-3 right-3 z-10 flex-row justify-between">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full bg-white/90 p-2"
        >
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

      <ScrollView className="flex-1 bg-white">
        <Image
          source={{ uri: mess.imageUrl }}
          className="h-64 w-full bg-gray-200"
          resizeMode="cover"
        />

        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900">
            {mess.name}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-500">
              {mess.address}
            </Text>
          </View>

          {/* ⭐ RATING */}
<View className="mt-3 flex-row items-center">
  {[1, 2, 3, 4, 5].map((i) => (
    <Pressable
      key={i}
      disabled={!isLoggedIn || hasRated}

      style={{ padding: 4 }}
    >
      <Ionicons
        name={i <= Math.round(displayRating) ? "star" : "star-outline"}
        size={20}
        color={i <= Math.round(displayRating) ? "#facc15" : "#d1d5db"}
      />
    </Pressable>
  ))}

  <Text className="ml-2 text-sm font-semibold text-gray-700">
    {rating.count > 0 ? rating.average.toFixed(1) : "New"}
  </Text>
</View>


          {!isLoggedIn && (
            <Text className="mt-1 text-xs text-gray-400">
              Login to rate
            </Text>
          )}

          {hasRated && (
            <Text className="mt-1 text-xs text-green-600">
              ✅ You already rated
            </Text>
          )}

          <Text className="mt-3 text-xl font-semibold text-green-600">
            ₹{mess.chargesPerMonth}{" "}
            <Text className="text-sm font-normal text-gray-500">
              / month
            </Text>
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            🍱 Food type: {mess.foodType}
          </Text>

          <Text className="mt-4 text-gray-700 leading-6">
            {mess.description}
          </Text>

          {/* CTA */}
          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={() => Linking.openURL(`tel:${mess.mobileNumber}`)}
              className="flex-1 flex-row items-center justify-center rounded-xl bg-green-500 py-3"
            >
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text className="ml-2 font-semibold text-white">
                Call
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL(`https://wa.me/91${mess.mobileNumber}`)
              }
              className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-900 py-3"
            >
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text className="ml-2 font-semibold text-white">
                WhatsApp
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
