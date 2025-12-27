import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { SavedMess } from "@/types/savedMess";
import { useAuth } from "@clerk/clerk-expo";

interface SavedContextType {
  saved: SavedMess[];
  toggleSave: (mess: SavedMess) => void;
  isSaved: (id: string) => boolean;
  loading: boolean;
  refreshSaved: () => Promise<void>;
}

const SavedContext = createContext<SavedContextType | null>(null);

export function SavedMessProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth(); // ✅ Clerk auth state
  const [saved, setSaved] = useState<SavedMess[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSaved = async () => {
  try {
    setLoading(true);
    const data = await AsyncStorage.getItem("savedMess");
    setSaved(data ? JSON.parse(data) : []);
  } finally {
    setLoading(false);
  }
};

  // Load saved messes
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const data = await AsyncStorage.getItem("savedMess");
        if (data) setSaved(JSON.parse(data));
      } finally {
        setLoading(false);
      }
    };
    loadSaved();
  }, []);

  // Persist
  useEffect(() => {
    AsyncStorage.setItem("savedMess", JSON.stringify(saved));
  }, [saved]);

  // 🔥 MAIN LOGIC
  const toggleSave = (mess: SavedMess) => {
    setSaved((prev) => {
      const alreadySaved = prev.some((m) => m._id === mess._id);

      // ❌ Guest limit
      if (!isSignedIn && !alreadySaved && prev.length >= 2) {
        Alert.alert(
          "Login required",
          "Sign in to save unlimited messes"
        );
        return prev;
      }

      // ✅ Toggle
      return alreadySaved
        ? prev.filter((m) => m._id !== mess._id)
        : [...prev, mess];
    });
  };

  const isSaved = (id: string) =>
    saved.some((m) => m._id === id);

  return (
    <SavedContext.Provider
      value={{ saved, loading, toggleSave, isSaved, refreshSaved }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export const useSavedMess = () => {
  const ctx = useContext(SavedContext);
  if (!ctx) {
    throw new Error("useSavedMess must be used inside provider");
  }
  return ctx;
};
