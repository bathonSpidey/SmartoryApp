import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fileIcon } from "./helpers";
import { FileEntry } from "./types";

type Props = {
  entry: FileEntry;
  onRemove: (id: string) => void;
  theme: ReturnType<typeof useTheme>;
};

export function FileRow({ entry, onRemove, theme }: Props) {
  const statusColor =
    entry.status === "done"
      ? theme.success
      : entry.status === "error"
        ? theme.error
        : entry.status === "processing"
          ? theme.primary
          : theme.textMuted;

  const statusIcon =
    entry.status === "done"
      ? "checkmark-circle"
      : entry.status === "error"
        ? "alert-circle"
        : "ellipse-outline";

  return (
    <View
      style={[
        styles.fileRow,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Ionicons
        name={fileIcon(entry.file.mimeType) as any}
        size={20}
        color={theme.textDim}
      />
      <Text
        style={[styles.fileRowName, { color: theme.text }]}
        numberOfLines={1}
      >
        {entry.file.name}
      </Text>

      {entry.status === "processing" ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : (
        <Ionicons name={statusIcon as any} size={18} color={statusColor} />
      )}

      {(entry.status === "pending" || entry.status === "error") && (
        <Pressable onPress={() => onRemove(entry.id)} hitSlop={8}>
          <Ionicons name="close" size={16} color={theme.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  fileRowName: {
    flex: 1,
    fontSize: Typography.size.sm,
  },
});
