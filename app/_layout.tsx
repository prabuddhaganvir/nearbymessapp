import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import { SavedMessProvider } from "@/context/SavedMessContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ClerkProvider,
  ClerkLoaded,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      {/* 🔥 THIS IS THE MISSING PIECE */}
      <ClerkLoaded>
        <SavedMessProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </SavedMessProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
