import { FlatList, Text, View, ActivityIndicator } from "react-native";
import MessCard from "@/components/mess/MessCard";
import { useSavedMess } from "@/context/SavedMessContext";

export default function Saved() {
  const { saved, loading } = useSavedMess(); // 👈 assume loading state

  /* 🔄 Loading state */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-500">
          Loading saved messes...
        </Text>
      </View>
    );
  }

  /* 💔 Empty state */
  if (!saved || saved.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-4xl">❤️</Text>
        <Text className="mt-3 text-gray-500">
          No saved mess yet
        </Text>
      </View>
    );
  }

  /* ✅ Main UI */
  return (
    <View className="flex-1 bg-white px-4 pt-6">
      
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-semibold text-black">
          Saved Messes
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          Your bookmarked places, ready anytime
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={saved}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <View className="rounded-2xl">
            <MessCard mess={item} />
          </View>
        )}
      />
    </View>
  );
}
