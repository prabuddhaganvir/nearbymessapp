import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Mess } from "@/types/mess";
import { useRouter } from "expo-router";
import { useSavedMess } from "@/context/SavedMessContext";

interface Props {
  mess: Mess;
}

export default function MessCard({ mess }: Props) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedMess();
  const saved = isSaved(mess._id);

  // ⭐ rating comes directly from API
  const rating = mess.rating ?? { average: 0, count: 0 };
  const filled = Math.round(rating.average);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/mess/[id]",
          params: { id: mess._id },
        })
      }
      className="mb-4 flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* IMAGE */}
      <Image
        source={{ uri: mess.imageUrl }}
        className="h-40 w-32 bg-gray-100"
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View className="flex-1 p-3">
        {/* NAME + FOOD TYPE + SAVE */}
        <View className="flex-row items-start justify-between">
          <Text
            className="flex-1 text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {mess.name}
          </Text>

          <View
            className={`ml-2 rounded-full px-2 py-0.5 ${
              mess.foodType === "veg"
                ? "bg-green-100"
                : mess.foodType === "non-veg"
                ? "bg-red-100"
                : "bg-yellow-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                mess.foodType === "veg"
                  ? "text-green-700"
                  : mess.foodType === "non-veg"
                  ? "text-red-700"
                  : "text-yellow-700"
              }`}
            >
              {mess.foodType.toUpperCase()}
            </Text>
          </View>

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

        {/* DISTANCE */}
        {mess.distance !== undefined && (
          <View className="mt-1 flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-500">
              {mess.distance.toFixed(2)} km away
            </Text>
          </View>
        )}

        {/* DESCRIPTION */}
        <Text className="text-sm text-gray-500">
          {mess.description?.split(" ").slice(0, 4).join(" ")}
        </Text>

        {/* ⭐ RATING (VIEW ONLY) */}
        <View className="mt-1 flex-row items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= filled ? "star" : "star-outline"}
              size={14}
              color={i <= filled ? "#facc15" : "#d1d5db"}
            />
          ))}

          <Text className="ml-1 text-xs font-semibold text-gray-700">
            {rating.count > 0 ? rating.average.toFixed(1) : "New"}
          </Text>
        </View>

        {/* PRICE */}
        <Text className="mt-1 text-base font-bold text-green-600">
          ₹{mess.chargesPerMonth}
          <Text className="text-sm font-normal text-gray-500"> / month</Text>
        </Text>
      </View>
    </Pressable>
  );
}
