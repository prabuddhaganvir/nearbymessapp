import { View, Text, Pressable, Image } from "react-native";
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
 <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-8 rounded-b-3xl shadow-sm">
        {/* Avatar */}
       <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center self-center mb-4 overflow-hidden">
  {user?.imageUrl ? (
    <Image
      source={{ uri: user.imageUrl }}
      className="w-full h-full"
      resizeMode="cover"
    />
  ) : (
    <Text className="text-gray-700 text-2xl font-bold">
      {user?.firstName?.[0] || "U"}
    </Text>
  )}
</View>

        {/* User Info */}
        <Text className="text-[22px] font-semibold tracking-tight text-center text-gray-900">
  {user?.fullName}
</Text>

        <Text className="text-sm text-center text-gray-500 mt-1">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Body */}
      <View className="px-6 mt-8 gap-4">
        {/* Plan Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-sm text-gray-500 mb-1">
            Your Plan
          </Text>
          <Text className="text-lg font-semibold text-gray-900">
            Free User 🎉
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Save unlimited messes & access contact details
          </Text>
        </View>

        {/* Actions */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Pressable
            onPress={() => signOut()}
            className="py-3 rounded-xl border border-red-200"
          >
            <Text className="text-center text-red-500 font-semibold">
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
