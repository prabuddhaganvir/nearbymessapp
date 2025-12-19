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
}

export default function MessDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [mess, setMess] = useState<Mess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const { toggleSave, isSaved } = useSavedMess();
const saved = isSaved(mess?._id ?? "");


  useEffect(() => {
    const fetchMess = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${id}`
        );

        if (!res.ok) throw new Error("Failed to load mess");

        const data = await res.json();
        setMess(data);
      } catch (err) {
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
       <View className="absolute top-14 left-3 right-3 z-10 flex-row justify-between">
        {/* BACK */}
        <Pressable
          onPress={() => router.back()}
          className="rounded-full bg-white/90 p-2"
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>

        {/* SAVE */}
    <Pressable
  onPress={() =>
   toggleSave({
  _id: mess._id,
  name: mess.name,
  imageUrl: mess.imageUrl,
  address:mess.address,
  chargesPerMonth: mess.chargesPerMonth,
  foodType:mess.foodType,
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
      {/* IMAGE */}
      <Image
        source={{ uri: mess.imageUrl }}
        className="h-64 w-full bg-gray-200"
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View className="p-4">
        {/* Name */}
        <Text className="text-2xl font-bold text-gray-900">
          {mess.name}
        </Text>

        {/* Address */}
        <View className="mt-2 flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-500">
            {mess.address}
          </Text>
        </View>

        {/* Price */}
        <Text className="mt-3 text-xl font-semibold text-green-600">
          ₹{mess.chargesPerMonth}
          <Text className="text-sm font-normal text-gray-500">
            {" "} / month
          </Text>
        </Text>

        {/* Food type */}
        <Text className="mt-1 text-sm text-gray-500">
          🍱 Food type: {mess.foodType}
        </Text>

        {/* Description */}
        <Text className="mt-4 text-gray-700 leading-6">
          {mess.description}
        </Text>

        {/* CTA */}
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={() =>
              Linking.openURL(`tel:${mess.mobileNumber}`)
            }
            className="flex-1 flex-row items-center justify-center rounded-xl bg-green-500 py-3"
          >
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text className="ml-2 font-semibold text-white">
              Call
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://wa.me/91${mess.mobileNumber}`
              )
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
