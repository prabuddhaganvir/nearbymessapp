import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useAuth, useUser } from "@clerk/clerk-expo";

/* ---------------- TYPES ---------------- */

type CheckOwnerResponse = {
  exists: boolean;
  messId: string | null;
};

/* ---------------- SCREEN ---------------- */

export default function AddMess() {
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();

  const [checking, setChecking] = useState(true);
  const [alreadyOwner, setAlreadyOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coords, setCoords] = useState<{
  lat: number | null;
  lng: number | null;
}>({
  lat: null,
  lng: null,
});


  const [form, setForm] = useState({
    email: user?.primaryEmailAddress?.emailAddress || "",
    name: "",
    description: "",
    chargesPerMonth: "",
    foodType: "veg",
    mobileNumber: "",
    address: "",
    imageUrl: "",
  });

  /* ---------------- CHECK OWNER ---------------- */

  useEffect(() => {
    if (!isLoaded) return;

    const checkOwner = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/check-owner`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = (await res.json()) as CheckOwnerResponse;
        if (data.exists) setAlreadyOwner(true);
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    };

    checkOwner();
  }, [isLoaded]);

  /* ---------------- IMAGE PICK + UPLOAD ---------------- */


type UploadResponse = {
  imageUrl: string;
};

const pickImage = async () => {
  // console.log("🟡 pickImage triggered");

 const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ keep this
  quality: 0.7,
});


  // console.log("🟡 ImagePicker result:", result);

  if (result.canceled) {
    // console.log("⚠️ Image picking cancelled");
    return;
  }

  try {
    setUploading(true);

    const token = await getToken();
    // console.log("🔑 Clerk token exists:", Boolean(token));

    if (!token) {
      throw new Error("No auth token");
    }

    const asset = result.assets[0];
    // console.log("🖼 Image asset:", asset);

    const formData = new FormData() as any;

    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName || "mess.jpg",
      type: asset.mimeType || "image/jpeg",
    } as any);

    // console.log("📤 Sending image to backend...");

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    // console.log("🌐 Upload response status:", res.status);

    const text = await res.text();
    // console.log("📦 Upload raw response:", text);

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const data = JSON.parse(text) as UploadResponse;
    // console.log("✅ Upload success:", data);

    if (!data.imageUrl) {
      throw new Error("imageUrl missing in response");
    }

    setForm((p) => ({ ...p, imageUrl: data.imageUrl }));
  } catch (err) {
    // console.error("❌ Image upload error:", err);
    Alert.alert("Image upload failed", String(err));
  } finally {
    setUploading(false);
  }
};




  /* ---------------- LOCATION ---------------- */

const detectLocation = async () => {
  try {
    // 1️⃣ Permission
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Location permission is required for accurate results"
      );
      return;
    }

    // 2️⃣ Ensure GPS is enabled (Android)
    const providerStatus =
      await Location.getProviderStatusAsync();

    if (!providerStatus.locationServicesEnabled) {
      Alert.alert(
        "Turn on GPS",
        "Please enable GPS for accurate location"
      );
      return;
    }

    // 3️⃣ HIGH ACCURACY LOCATION
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation, // 🔥 MOST ACCURATE
      timeInterval: 1000,
      distanceInterval: 1,
    });

    const { latitude, longitude, accuracy } = loc.coords;

    // console.log("📍 Latitude:", latitude);
    // console.log("📍 Longitude:", longitude);
    // console.log("🎯 Accuracy (meters):", accuracy);

    // 4️⃣ Save exact coords
    setCoords({
      lat: latitude,
      lng: longitude,
    });

    // 5️⃣ Reverse geocode ONLY for display
    const geo = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const place =
      geo[0]?.street ||
      geo[0]?.city ||
      geo[0]?.district ||
      geo[0]?.region;

      if (accuracy && accuracy > 50) {
  Alert.alert(
    "Low accuracy",
    "Move to an open area for better GPS accuracy"
  );
}

    if (place) {
      setForm((p) => ({ ...p, address: place }));

    }
  } catch (err) {
    // console.error("❌ Location error:", err);
    Alert.alert("Unable to fetch accurate location");
  }
};


  /* ---------------- SUBMIT ---------------- */

  const submit = async () => {
    if (
      !form.name ||
      !form.address ||
      !form.chargesPerMonth ||
      !form.mobileNumber
    ) {
      Alert.alert("Fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mess/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  ...form,
  chargesPerMonth: Number(form.chargesPerMonth),
  mobileNumber: Number(form.mobileNumber),
  lat: coords.lat,
  lng: coords.lng,
}),

        }
      );

      if (!res.ok) throw new Error();

      Alert.alert("Success 🎉", "Mess added", [
        {
          text: "Go to Your Mess",
          onPress: () => router.replace("/profile/your-mess"),
        },
      ]);
    } catch {
      Alert.alert("Failed to add mess");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (checking) {
    return (
      <View style={styles.center}>
           <ActivityIndicator size="large" color="orange"/>
        <Text style={styles.muted}>Checking owner status…</Text>
      </View>
    );
  }

  if (alreadyOwner) {
    return (
      <View style={styles.center}>
        <Text style={styles.blockEmoji}>🚫</Text>
        <Text style={styles.blockTitle}>
          You already have a mess
        </Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            router.replace("/profile/your-mess")
          }
        >
          <Text style={styles.primaryText}>
            Go to Your Mess
          </Text>
        </Pressable>
      </View>
    );
  }

  /* ---------------- FORM ---------------- */

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Add Your Mess</Text>

      {/* Email (prefilled) */}
      <Input label="Email" value={form.email} editable={false} />

      {/* Image */}
      <Pressable onPress={pickImage} style={styles.imageBox}>
        {uploading ? (
          <ActivityIndicator />
        ) : form.imageUrl ? (
          <Image
            source={{ uri: form.imageUrl }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.imageText}>Upload Image</Text>
        )}
      </Pressable>

      <Input
        label="Mess Name *"
        value={form.name}
        onChange={(v) =>
          setForm((p) => ({ ...p, name: v }))
        }
      />

      <Input
        label="Description"
        multiline
        value={form.description}
        onChange={(v) =>
          setForm((p) => ({ ...p, description: v }))
        }
      />

      {/* Food type */}
      <Text style={styles.label}>Food Type *</Text>
      <View style={styles.row}>
        {["veg", "nonveg", "both"].map((t) => (
          <Pressable
            key={t}
            onPress={() =>
              setForm((p) => ({ ...p, foodType: t }))
            }
            style={[
              styles.pill,
              form.foodType === t && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                form.foodType === t &&
                  styles.pillTextActive,
              ]}
            >
              {t.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Monthly Charges *"
        keyboardType="numeric"
        value={form.chargesPerMonth}
        onChange={(v) =>
          setForm((p) => ({ ...p, chargesPerMonth: v }))
        }
      />

      <Input
        label="Mobile Number *"
        keyboardType="phone-pad"
        value={form.mobileNumber}
        onChange={(v) =>
          setForm((p) => ({ ...p, mobileNumber: v }))
        }
      />

      <Input
        label="Address *"
        value={form.address}
        onChange={(v) =>
          setForm((p) => ({ ...p, address: v }))
        }
      />

      <Pressable
        onPress={detectLocation}
        style={styles.locationBtn}
      >
        <Text style={styles.locationText}>
          📍 Auto-detect location
        </Text>
      </Pressable>

      <Pressable
        onPress={submit}
        style={styles.submitBtn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Add Mess</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  editable = true,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          !editable && styles.disabled,
        ]}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0F172A",
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  disabled: { backgroundColor: "#F1F5F9" },
  imageBox: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: { width: "100%", height: "100%", borderRadius: 16 },
  imageText: { color: "#475569", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10, marginBottom: 14 },
  pill: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillActive: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  pillText: { fontSize: 12, fontWeight: "600" },
  pillTextActive: { color: "#fff" },
  locationBtn: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  locationText: {
    color: "#F97316",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  muted: { color: "#64748B", marginTop: 8 },
  blockEmoji: { fontSize: 48 },
  blockTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#0F172A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  primaryText: { color: "#fff", fontWeight: "600" },
});
