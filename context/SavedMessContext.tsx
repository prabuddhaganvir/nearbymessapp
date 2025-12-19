import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedMess } from "@/types/savedMess";
import { Alert } from "react-native";

interface SavedContextType {
  saved: SavedMess[];
  toggleSave: (mess: SavedMess) => void;
  isSaved: (id: string) => boolean;
   loading: boolean;  
}


const SavedContext = createContext<SavedContextType | null>(null);

export function SavedMessProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedMess[]>([]);
   const [loading, setLoading] = useState(true);

   
useEffect(() => {
  const loadSaved = async () => {
    setLoading(true); // ✅ start loading

    const data = await AsyncStorage.getItem("savedMess");
    if (data) {
      setSaved(JSON.parse(data));
    }

    setLoading(false); // ✅ stop loading after fetch
  };

  loadSaved();
}, []);

useEffect(() => {
  AsyncStorage.setItem("savedMess", JSON.stringify(saved));
}, [saved]);

 const toggleSave = (mess: SavedMess) => {
  setSaved((prev) => {
    const alreadySaved = prev.some((m) => m._id === mess._id);

    // ❌ trying to add 4th mess
    if (!alreadySaved && prev.length >= 2) {
      Alert.alert(
        "Limit reached",
        "You can save only 2 messes. Remove one to add another.",
        [{ text: "OK" }]
      );
      return prev; // ⛔ block add
    }

    // ✅ normal toggle
    return alreadySaved
      ? prev.filter((m) => m._id !== mess._id)
      : [...prev, mess];
  });
};

  const isSaved = (id: string) =>
    saved.some((m) => m._id === id);

  return (
    <SavedContext.Provider value={{ saved, loading, toggleSave, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export const useSavedMess = () => {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSavedMess must be used inside provider");
  return ctx;
};
