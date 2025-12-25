import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Image } from "react-native";
import type { Mess } from "@/types/mess";



type CheckOwnerResponse = {
  exists: boolean;
  messId: string | null;
};


export default function YourMess() {
  const { getToken, isLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [mess, setMess] = useState<Mess | null>(null);

useEffect(() => {
  if (!isLoaded) return;

  const fetchMess = async () => {
    try {
      // console.log("📦 Fetching your mess");

      const token = await getToken();
      if (!token) {
        // console.log("❌ No token");
        return;
      }

      // 1️⃣ check owner
      const res1 = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mess/check-owner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("🌐 check-owner status:", res1.status);

      if (!res1.ok) {
        throw new Error("check-owner failed");
      }


const ownerData = (await res1.json()) as CheckOwnerResponse;
      // console.log("check-owner data:", ownerData);

      if (!ownerData.exists) {
        setMess(null);
        return;
      }

      // 2️⃣ fetch mess by ID (SAME AS WEB)
      const res2 = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${ownerData.messId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("🌐 mess-by-id status:", res2.status);

      if (!res2.ok) {
        throw new Error("fetch mess by id failed");
      }

      const messData = (await res2.json()) as Mess;
      setMess(messData);

    } catch (err) {
      // console.error("❌ Fetch mess error:", err);
      Alert.alert("Error", "Unable to load your mess");
    } finally {
      setLoading(false);
    }
  };

  fetchMess();
}, [isLoaded]);

const handleDelete = async () => {
  try {
    const token = await getToken();
    if (!token || !mess?._id) return;

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${mess._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    Alert.alert("Deleted 🗑️", "Your mess has been deleted", [
      {
        text: "OK",
        onPress: () => router.replace("/profile"),
      },
    ]);
  } catch (err) {
    // console.error("❌ Delete mess error:", err);
    Alert.alert("Error", "Failed to delete mess");
  }
};



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="orange"/>
        <Text style={styles.muted}>Loading your mess…</Text>
      </View>
    );
  }

  if (!mess) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No mess found</Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.replace("/profile/add-mess")}
        >
          <Text style={styles.primaryText}>Add Your Mess</Text>
        </Pressable>
      </View>
    );
  }

  return (
    
<View style={styles.container}>
  {/* 🔥 HERO IMAGE */}
  <View style={styles.imageWrapper}>
    <Image
      source={{
        uri:
          mess.imageUrl ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      }}
      style={styles.image}
    />
  </View>

  {/* 🧾 CARD */}
  <View style={styles.card}>
    <Text style={styles.heading}>{mess.name}</Text>

    <View style={styles.metaRow}>
      <Text style={styles.meta}>📍 {mess.address}</Text>
      <Text style={styles.meta}>🍽️ {mess.foodType}</Text>
    </View>

    <View style={styles.stats}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Price</Text>
        <Text style={styles.statValue}>₹{mess.chargesPerMonth}</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Contact</Text>
        <Text style={styles.statValue}>{mess.mobileNumber}</Text>
      </View>
    </View>

    {/* 🎯 ACTIONS */}
    <View style={styles.row}>
      <Pressable
        style={styles.editBtn}
        onPress={() =>
router.push({
  pathname: "/profile/edit-mess/[id]",
  params: { id: mess._id },
})



        }
      >
        <Text style={styles.btnText}>✏️ Edit</Text>
      </Pressable>

      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert(
            "Delete mess?",
            "This action cannot be undone",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: handleDelete,
              },
            ]
          )
        }
      >
        <Text style={styles.btnText}>🗑 Delete</Text>
      </Pressable>
    </View>
  </View>
</View>

  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
   center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
  },
  imageWrapper: {
    height: 220,
    width: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  card: {
    marginTop: -30,
    marginHorizontal: 16,
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000ff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  meta: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#1F2933",
    borderRadius: 14,
    padding: 14,
  },

  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  statValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  editBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  muted: {
  marginTop: 12,
  fontSize: 14,
  color: "#9CA3AF", // soft gray
},

title: {
  fontSize: 20,
  fontWeight: "600",
  color: "#FFFFFF",
  marginBottom: 16,
},

primaryBtn: {
  marginTop: 20,
  backgroundColor: "#10B981", // emerald
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 14,
},

primaryText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "600",
},

});
