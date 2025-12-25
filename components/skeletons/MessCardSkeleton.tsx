import React from "react";
import { View, StyleSheet } from "react-native";

export default function MessCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Image skeleton */}
      <View style={styles.image} />

      {/* Content skeleton */}
      <View style={styles.content}>
        <View style={styles.lineLarge} />
        <View style={styles.lineMedium} />
        <View style={styles.lineSmall} />

        <View style={styles.buttonRow}>
          <View style={styles.buttonSmall} />
          <View style={styles.buttonMedium} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
  },

  image: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  lineLarge: {
    height: 16,
    width: "75%",
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },

  lineMedium: {
    marginTop: 8,
    height: 12,
    width: "50%",
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },

  lineSmall: {
    marginTop: 8,
    height: 16,
    width: "33%",
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },

  buttonRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },

  buttonSmall: {
    height: 32,
    width: 80,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  buttonMedium: {
    height: 32,
    width: 96,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
});
