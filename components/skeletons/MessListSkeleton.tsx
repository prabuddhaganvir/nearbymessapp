import { View } from "react-native";
import MessCardSkeleton from "./MessCardSkeleton";

export default function MessListSkeleton() {
  return (
    <View>
      {Array.from({ length: 4 }).map((_, i) => (
        <MessCardSkeleton key={i} />
      ))}
    </View>
  );
}
