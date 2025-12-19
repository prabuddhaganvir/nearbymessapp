import { View } from "react-native";

export default function MessCardSkeleton() {
  return (
    <View className="mb-4 flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white p-3">
      
      {/* Image skeleton */}
      <View className="h-32 w-32 rounded-xl bg-gray-200" />

      {/* Content skeleton */}
      <View className="ml-3 flex-1 justify-between">
        <View className="h-4 w-3/4 rounded bg-gray-200" />
        <View className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
        <View className="mt-2 h-4 w-1/3 rounded bg-gray-200" />

        <View className="mt-3 flex-row gap-2">
          <View className="h-8 w-20 rounded-lg bg-gray-200" />
          <View className="h-8 w-24 rounded-lg bg-gray-200" />
        </View>
      </View>
    </View>
  );
}
