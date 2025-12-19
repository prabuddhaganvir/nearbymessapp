import { View, Text } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Profile() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  // 🔓 Logged OUT
  if (!isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-lg font-semibold mb-2">
          Welcome to NearByMess
        </Text>
        <Text className="text-sm text-gray-500 mb-6 text-center">
          Login with Google to save unlimited messes
        </Text>

        <GoogleLoginButton />
      </View>
    );
  }

  // 🔒 Logged IN
  return (
    <View className="flex-1 px-6 pt-10 bg-white">
      {/* User Info */}
      <View className="items-center mb-8">
        <Text className="text-xl font-semibold">
          {user?.fullName}
        </Text>
        <Text className="text-sm text-gray-500">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Actions */}
      <View className="gap-4">
        <Text className="text-sm text-gray-400">
          You can now save unlimited messes
        </Text>

        <Text
          onPress={() => signOut()}
          className="text-center text-red-500 font-semibold"
        >
          Logout
        </Text>
      </View>
    </View>
  );
}
