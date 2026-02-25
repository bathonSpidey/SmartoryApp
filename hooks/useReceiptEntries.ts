import { uniqueId } from "@/components/scan/helpers";
import { FileEntry } from "@/components/scan/types";
import { extractReceipt } from "@/lib/receipt.service";
import { Session } from "@supabase/supabase-js";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useReceiptEntries(session: Session | null) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickFromCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission required",
        "Camera access is needed to scan receipts.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (result.canceled || !result.assets.length) return;
    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    setEntries((prev) => [
      ...prev,
      {
        id: uniqueId(),
        file: {
          uri: asset.uri,
          name: asset.fileName ?? `receipt_photo.${ext}`,
          mimeType: asset.mimeType ?? `image/${ext}`,
        },
        status: "pending",
      },
    ]);
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Photo library access is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.9,
    });
    if (result.canceled || !result.assets.length) return;
    setEntries((prev) => [
      ...prev,
      ...result.assets.map((asset) => {
        const ext = asset.uri.split(".").pop() ?? "jpg";
        return {
          id: uniqueId(),
          file: {
            uri: asset.uri,
            name: asset.fileName ?? `image.${ext}`,
            mimeType: asset.mimeType ?? `image/${ext}`,
          },
          status: "pending" as const,
        };
      }),
    ]);
  }, []);

  const pickDocument = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets.length) return;
    setEntries((prev) => [
      ...prev,
      ...result.assets.map((asset) => ({
        id: uniqueId(),
        file: {
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType ?? "application/octet-stream",
        },
        status: "pending" as const,
      })),
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearEntries = useCallback(() => setEntries([]), []);

  const extractAll = useCallback(async () => {
    if (!session?.access_token) {
      Alert.alert("Not signed in", "Please sign in to extract receipts.");
      return;
    }
    const pending = entries.filter((e) => e.status === "pending");
    if (!pending.length) return;

    setIsProcessing(true);
    for (const entry of pending) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, status: "processing" } : e,
        ),
      );
      try {
        const response = await extractReceipt(session.access_token, entry.file);
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: "done", result: response.data }
              : e,
          ),
        );
      } catch (err: any) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? {
                  ...e,
                  status: "error",
                  error: err?.message ?? "Extraction failed",
                }
              : e,
          ),
        );
      }
    }
    setIsProcessing(false);
  }, [entries, session]);

  return {
    entries,
    isProcessing,
    pickFromCamera,
    pickFromLibrary,
    pickDocument,
    removeEntry,
    clearEntries,
    extractAll,
  };
}
