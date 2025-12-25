import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

/* ---------------- TYPES ---------------- */

type Mess = {
  _id: string;
  name: string;
  description: string;
  address: string;
  chargesPerMonth: number;
  foodType: string;
  mobileNumber: number;
  imageUrl?: string;
};

/* ---------------- CONSTANTS ---------------- */

const SCREEN_HEIGHT = Dimensions.get("window").height;

/* ---------------- SCREEN ---------------- */

export default function EditMess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken, isLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Mess | null>(null);
  const [showStickySave, setShowStickySave] = useState(false);

  /* ---------------- FETCH MESS ---------------- */

  useEffect(() => {
    if (!isLoaded || !id) return;

    const loadMess = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to load mess");

        const data = (await res.json()) as Mess;
        setForm(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to load mess");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadMess();
  }, [isLoaded, id]);

  /* ---------------- SAVE ---------------- */

  const saveChanges = async () => {
    if (!form) return;

    try {
      setSaving(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mess/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            address: form.address,
            chargesPerMonth: Number(form.chargesPerMonth),
            foodType: form.foodType,
            mobileNumber: Number(form.mobileNumber),
            imageUrl: form.imageUrl,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      Alert.alert("Success 🎉", "Mess updated successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/profile/your-mess"),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update mess");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- SCROLL UX ---------------- */

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowStickySave(y > SCREEN_HEIGHT * 0.4);
  };

  /* ---------------- LOADING ---------------- */

  if (loading || !form) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading mess…</Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.page}>
      {/* 🔥 STICKY SAVE BAR */}
      {showStickySave && (
        <View style={styles.stickyBar}>
          <Pressable
            onPress={saveChanges}
            disabled={saving}
            style={styles.stickySaveBtn}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.stickySaveText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Edit Your Mess</Text>
        <Text style={styles.subtitle}>
          Update details visible to customers
        </Text>

        <View style={styles.card}>
          <Input
            label="Mess Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Description"
            value={form.description}
            multiline
            onChange={(v) =>
              setForm({ ...form, description: v })
            }
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />

          <Input
            label="Charges per Month"
            keyboardType="numeric"
            value={String(form.chargesPerMonth)}
            onChange={(v) =>
              setForm({
                ...form,
                chargesPerMonth: Number(v),
              })
            }
          />

          <Input
            label="Mobile Number"
            keyboardType="phone-pad"
            value={String(form.mobileNumber)}
            onChange={(v) =>
              setForm({
                ...form,
                mobileNumber: Number(v),
              })
            }
          />

          <Input
            label="Image URL"
            value={form.imageUrl || ""}
            onChange={(v) =>
              setForm({ ...form, imageUrl: v })
            }
          />
        </View>

        {/* Bottom fallback */}
        <Pressable
          onPress={saveChanges}
          disabled={saving}
          style={[
            styles.saveBtn,
            saving && { opacity: 0.6 },
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ---------------- INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline && {
            height: 100,
            textAlignVertical: "top",
          },
        ]}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  muted: {
    marginTop: 12,
    color: "#6B7280",
  },

  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  field: {
    marginBottom: 14,
  },

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
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },

  saveBtn: {
    marginTop: 24,
    backgroundColor: "#0F172A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  stickyBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 20,
  },

  stickySaveBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  stickySaveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
