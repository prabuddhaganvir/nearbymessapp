import React from "react";
import { Text, View, StyleSheet } from "react-native";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

export default function TopBarGreet() {
  return (
    <View>
      <Text style={styles.title}>
        {getGreeting()} 👋
      </Text>
      <Text style={styles.subtitle}>
        Nearby mess, zero hassle
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 1,
    fontSize: 14,
    color: "#6B7280",
  },
});
