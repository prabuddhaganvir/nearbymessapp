import "../global.css"
import { SavedMessProvider } from "@/context/SavedMessContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};
  return (
      <ClerkProvider
  publishableKey="pk_test_c3Rhci1waWdlb24tNzIuY2xlcmsuYWNjb3VudHMuZGV2JA"
  tokenCache={tokenCache}
>
  <SavedMessProvider>
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  </SavedMessProvider>
</ClerkProvider>
  );
}
