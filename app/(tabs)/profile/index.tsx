import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { router } from "expo-router";

export default function Profile() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  // 🔓 Logged OUT
  if (!isSignedIn) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.welcomeTitle}>
          Welcome to NearByMess
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Login with Google to save unlimited messes
        </Text>

        <GoogleLoginButton />
      </View>
    );
  }

  // 🔒 Logged IN (SCROLLABLE)
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarFallback}>
              {user?.firstName?.[0] || "U"}
            </Text>
          )}
        </View>

        <Text style={styles.userName}>
          {user?.fullName}
        </Text>

        <Text style={styles.userEmail}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Owner / Mess Actions */}
 <View style={styles.listCard}>
  <Pressable
    style={styles.listItem}
    onPress={() => router.push("/profile/add-mess")}
  >
    <Text style={styles.listText}>🍽️ Become Owner</Text>
    <Text style={styles.arrow}>›</Text>
  </Pressable>

  <View style={styles.divider} />

  <Pressable
    style={styles.listItem}
    onPress={() => router.push("/profile/your-mess")}
  >
    <Text style={styles.listText}>🏠 Your Mess</Text>
    <Text style={styles.arrow}>›</Text>
  </Pressable>
</View>


      {/* Body */}
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your Plan</Text>
          <Text style={styles.cardTitle}>Free User 🎉</Text>
          <Text style={styles.cardSub}>
            Save unlimited messes & access contact details
          </Text>
        </View>

        <View style={styles.card}>
          <Pressable
            onPress={() => signOut()}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        </View>

        {/* Footer */}

          <View style={styles.footer}>
      {/* About */}
      <Text style={styles.appName}>NearByMess</Text>
      <Text style={styles.about}>
        NearByMess helps you find trusted mess & tiffin services near you —
        simple, fast, and local.
      </Text>

      {/* Links */}
      <View style={styles.links}>
        <Pressable onPress={() => Linking.openURL("mailto:support@nearbymess.com")}>
          <Text style={styles.link}>📧 support@nearbymess.com</Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("https://nearbymess.vercel.app")}>
          <Text style={styles.link}>🌐 Visit Website</Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("https://nearbymess.com/privacy")}>
          <Text style={styles.link}>🔒 Privacy Policy</Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("https://nearbymess.com/terms")}>
          <Text style={styles.link}>📄 Terms & Conditions</Text>
        </Pressable>
      </View>

      <View style={styles.disclaimerBox}>
  <Text style={styles.disclaimer}>
    NearByMess is an early demo built independently.
    Some features may be incomplete or buggy.
    Feedback is always welcome.
  </Text>
</View>
 {/* Footer Bottom */}
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.copy}>
        © {new Date().getFullYear()} NearByMess. All rights reserved.
      </Text>

    </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    paddingBottom: 32, // 👈 important for scroll end
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
  },

  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },

  listCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  listText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },

  arrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 18,
  },

  body: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  cardSub: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    textAlign: "center",
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
  },
   footer: {
    padding: 20,
    marginTop: 40,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  about: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  links: {
    gap: 8,
    marginBottom: 16,
  },
  link: {
    fontSize: 14,
    color: "#2563eb",
  },
  version: {
    fontSize: 12,
    color: "#9ca3af",
  },
  copy: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },
  disclaimerBox: {
  marginTop: 16,
  padding: 12,
  borderRadius: 12,
  backgroundColor: "#f9fafb",
  borderWidth: 1,
  borderColor: "#e5e7eb",
},
disclaimer: {
  fontSize: 12,
  color: "#9ca3af", // soft gray
  textAlign: "center",
  lineHeight: 18,
  marginTop: 12,
  paddingHorizontal: 20,
},


});
