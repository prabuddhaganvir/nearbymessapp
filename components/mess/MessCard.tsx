import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Mess } from "@/types/mess";
import { Link, useRouter } from "expo-router";
import { useSavedMess } from "@/context/SavedMessContext";


interface Props {
  mess: Mess;
}

export default function MessCard({ mess }: Props) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedMess();
  const saved = isSaved(mess._id);

  const rating = mess.rating ?? { average: 0, count: 0 };
  const filled = Math.round(rating.average);

  const foodTypeStyle =
    mess.foodType === "veg"
      ? styles.veg
      : mess.foodType === "non-veg"
      ? styles.nonVeg
      : styles.otherFood;

  const foodTextStyle =
    mess.foodType === "veg"
      ? styles.vegText
      : mess.foodType === "non-veg"
      ? styles.nonVegText
      : styles.otherFoodText;

  return (
<Link
 href={{ pathname: "/[id]", params: { id: mess._id } } as any}
  asChild
>
  
    <Pressable
      style={styles.card}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: mess.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View style={styles.content}>
        {/* NAME + FOOD TYPE + SAVE */}
        <View style={styles.topRow}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {mess.name}
          </Text>

          <View style={[styles.foodBadge, foodTypeStyle]}>
            <Text style={[styles.foodText, foodTextStyle]}>
              {mess.foodType.toUpperCase()}
            </Text>
          </View>

          <Pressable
            onPress={() =>
              toggleSave({
                _id: mess._id,
                name: mess.name,
              imageUrl: mess.imageUrl || "",
                address: mess.address,
                chargesPerMonth: mess.chargesPerMonth,
                foodType: mess.foodType,
              })
            }
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={22}
              color={saved ? "#EF4444" : "#111827"}
            />
          </Pressable>
        </View>

        {/* DISTANCE */}
        {mess.distance !== undefined && (
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.distanceText}>
              {mess.distance.toFixed(2)} km away
            </Text>
          </View>
        )}

        {/* DESCRIPTION */}
        <Text style={styles.description}>
          {mess.description?.split(" ").slice(0, 4).join(" ")}
        </Text>

        {/* ⭐ RATING */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= filled ? "star" : "star-outline"}
              size={14}
              color={i <= filled ? "#FACC15" : "#D1D5DB"}
            />
          ))}

          <Text style={styles.ratingText}>
            {rating.count > 0
              ? rating.average.toFixed(1)
              : "New"}
          </Text>
        </View>

        {/* PRICE */}
        <Text style={styles.price}>
          ₹{mess.chargesPerMonth}
          <Text style={styles.perMonth}> / month</Text>
        </Text>
      </View>
    </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bebcbaff",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 2,
  },

  image: {
    width: 128,
    height: 160,
    backgroundColor: "#F3F4F6",
  },

  content: {
    flex: 1,
    padding: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  foodBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  foodText: {
    fontSize: 10,
    fontWeight: "600",
  },

  veg: {
    backgroundColor: "#DCFCE7",
  },
  vegText: {
    color: "#15803D",
  },

  nonVeg: {
    backgroundColor: "#FEE2E2",
  },
  nonVegText: {
    color: "#B91C1C",
  },

  otherFood: {
    backgroundColor: "#FEF9C3",
  },
  otherFoodText: {
    color: "#A16207",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  distanceText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  description: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 2,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },

  perMonth: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6B7280",
  },
});
