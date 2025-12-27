import React, { useState } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";

export default function GoogleLoginButton() {
  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      // console.log("➡️ Starting Google OAuth");

      /**
       * ✅ IMPORTANT
       * - Expo Go → this becomes exp://... automatically
       * - APK / Prod → uses nearbymess://oauth
       */
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "nearbymess",
        path: "oauth",
      });

      // console.log("🔁 Redirect URL:", redirectUrl);

      const result = await startOAuthFlow({
        redirectUrl: "nearbymess://oauth",
      });

      console.log("⬅️ OAuth result:", result);

      if (!result?.createdSessionId || !result?.setActive) {
        // console.warn("❌ OAuth cancelled or incomplete");
        return;
      }

      await result.setActive({
        session: result.createdSessionId,
      });

  WebBrowser.dismissBrowser();

// 👇 THIS LINE FIXES EVERYTHING
router.replace("/(tabs)/profile");

      // console.log("✅ Clerk session activated");

    } catch (error) {
      // console.error("❌ Google login error:", error);
      Alert.alert("Login failed", "Unable to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleLogin}
      disabled={loading}
      style={[
        styles.button,
        loading ? styles.disabled : styles.enabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>Continue with Google</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  enabled: {
    backgroundColor: "#111827",
  },
  disabled: {
    backgroundColor: "#9CA3AF",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
