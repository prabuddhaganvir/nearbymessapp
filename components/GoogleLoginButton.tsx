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

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await startOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (!result?.createdSessionId || !result?.setActive) {
        // user cancelled or flow incomplete
        return;
      }

      await result.setActive({
        session: result.createdSessionId,
      });
    } catch (err: any) {
      console.error(
        "Google login error:",
        JSON.stringify(err, null, 2)
      );

      Alert.alert(
        "Login failed",
        err?.errors?.[0]?.longMessage ||
          "Unable to sign in with Google"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={login}
      disabled={loading}
      style={[
        styles.button,
        loading ? styles.disabled : styles.enabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>
          Continue with Google
        </Text>
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
