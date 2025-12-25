import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/clerk-expo";

type Props = {
  value?: string;
  onUpload: (url: string) => void;
};

export default function CloudinaryUpload({
  value,
  onUpload,
}: Props) {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    try {
      setUploading(true);

      const token = await getToken();
      if (!token) throw new Error("No token");

      const asset = result.assets[0];
      const formData = new FormData() as any;

      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName || "image.jpg",
        type: asset.mimeType || "image/jpeg",
      } as any);

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

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Upload failed");
      }

      const data = JSON.parse(text) as { imageUrl: string };

      onUpload(data.imageUrl);
    } catch (err) {
      console.error(err);
      Alert.alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Pressable
        onPress={pickImage}
        disabled={uploading}
        style={styles.uploadBtn}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>
            📤 Upload Image
          </Text>
        )}
      </Pressable>

      {value && (
        <Image
          source={{ uri: value }}
          style={styles.preview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginTop: 8,
  },
});
