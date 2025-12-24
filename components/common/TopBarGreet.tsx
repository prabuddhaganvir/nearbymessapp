import { Text } from "react-native";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

export default function TopBarGreet() {
  return (
    <Text className="font-bold text-2xl">
      {getGreeting()} 👋
      {"\n"}
      <Text className="text-sm text-gray-500">Nearby mess, zero hassle</Text>
      
    </Text>
  );
}

