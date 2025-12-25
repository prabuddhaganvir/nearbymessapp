import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import TopBarGreet from "../../components/common/TopBarGreet";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#000000ff" />

      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#f5f1ecff" },
          headerTintColor: "#010101de",
          tabBarStyle: {
            backgroundColor: "#f4f5f8ff",
            borderTopColor: "#1F2937",
            height: 64,
          },
          tabBarActiveTintColor: "#F97316",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: () => <TopBarGreet />,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* SAVED */}
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />

   <Tabs.Screen
  name="profile"
  options={{
    title: "Profile",
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? "person" : "person-outline"}
        size={22}
        color={color}
      />
      
    ),
  }}
/>

     
        
      </Tabs>
    </>
  );
}
