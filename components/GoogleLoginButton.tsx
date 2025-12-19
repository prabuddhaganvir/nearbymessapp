import { Pressable, Text, ActivityIndicator, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

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
      redirectUrl: "nearbymessnew://",
    });

    if (!result?.createdSessionId || !result?.setActive) {
      // user cancelled or flow incomplete
      return;
    }

    await result.setActive({
      session: result.createdSessionId,
    });
  } catch (err: any) {
    console.error("Google login error:", JSON.stringify(err, null, 2));

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
      className={`px-4 py-3 rounded-xl ${
        loading ? "bg-gray-400" : "bg-black"
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-center font-semibold">
          Continue with Google
        </Text>
      )}
    </Pressable>
  );
}
