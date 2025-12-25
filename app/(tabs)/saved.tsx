import React from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MessCard from "@/components/mess/MessCard";
import { useSavedMess } from "@/context/SavedMessContext";

export default function Saved() {
  const { saved, loading } = useSavedMess();

  /* 🔄 Loading state */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.subtleText}>
          Loading saved messes...
        </Text>
      </View>
    );
  }

  /* 💔 Empty state */
  if (!saved || saved.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>❤️</Text>
        <Text style={styles.subtleText}>
          No saved mess yet
        </Text>
      </View>
    );
  }

  /* ✅ Main UI */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Saved Messes
        </Text>
        <Text style={styles.subtitle}>
          Your bookmarked places, ready anytime
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={saved}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MessCard mess={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  center: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Text */
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },

  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },

  subtleText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },

  emoji: {
    fontSize: 40,
  },

  /* Header */
  header: {
    marginBottom: 24,
  },

  /* List */
  listContent: {
    paddingBottom: 24,
  },

  separator: {
    height: 16,
  },

  cardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
