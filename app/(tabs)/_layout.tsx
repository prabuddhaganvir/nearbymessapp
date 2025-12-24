import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopBarGreet from "../../components/common/TopBarGreet"
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#22c55e" />
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#f86c01ff",   // tailwind green-500
        tabBarInactiveTintColor: "#9ca3af",// tailwind gray-400

      }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => <TopBarGreet />,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

      </Tabs>
    </>
  );
}
