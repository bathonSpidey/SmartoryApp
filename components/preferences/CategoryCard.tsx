import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Category, CategoryUpdatePayload } from "@/lib/categories.service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type Props = {
  item: Category;
  onEdit: (id: string, payload: CategoryUpdatePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function CategoryCard({ item, onEdit, onDelete }: Props) {
  const theme = useTheme();
  const [editing, setEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(item.name);
  const [draftDays, setDraftDays] = React.useState(String(item.shelf_days));
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSave = async () => {
    const trimmedName = draftName.trim();
    const parsedDays = parseInt(draftDays, 10);
    if (
      !trimmedName ||
      isNaN(parsedDays) ||
      parsedDays < 1 ||
      (trimmedName === item.name && parsedDays === item.shelf_days)
    ) {
      setEditing(false);
      setDraftName(item.name);
      setDraftDays(String(item.shelf_days));
      return;
    }
    setSaving(true);
    try {
      await onEdit(item.id, { name: trimmedName, shelf_days: parsedDays });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftName(item.name);
    setDraftDays(String(item.shelf_days));
    setEditing(false);
  };

  const confirmAndDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <DeleteConfirmModal
        visible={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={confirmAndDelete}
        deleting={deleting}
      />

      <View
        style={[
          styles.row,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            opacity: deleting ? 0.5 : 1,
          },
        ]}
      >
        {editing ? (
          /* ── Edit mode ────────────────────────────── */
          <View style={styles.editRow}>
            <TextInput
              style={[
                styles.editInputName,
                {
                  color: theme.text,
                  backgroundColor: theme.surfaceInput,
                  borderColor: theme.primary + "66",
                },
              ]}
              value={draftName}
              onChangeText={setDraftName}
              autoFocus
              placeholder="Name"
              placeholderTextColor={theme.textDim}
              returnKeyType="next"
            />
            <TextInput
              style={[
                styles.editInputDays,
                {
                  color: theme.text,
                  backgroundColor: theme.surfaceInput,
                  borderColor: theme.primary + "66",
                },
              ]}
              value={draftDays}
              onChangeText={setDraftDays}
              keyboardType="number-pad"
              placeholder="Days"
              placeholderTextColor={theme.textDim}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={[styles.iconBtn, { backgroundColor: theme.primary }]}
            >
              {saving ? (
                <ActivityIndicator size={12} color="#fff" />
              ) : (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </Pressable>
            <Pressable
              onPress={handleCancel}
              disabled={saving}
              style={[styles.iconBtn, { backgroundColor: theme.surfaceInput }]}
            >
              <Ionicons name="close" size={14} color={theme.textDim} />
            </Pressable>
          </View>
        ) : (
          /* ── Display mode ─────────────────────────── */
          <View style={styles.displayRow}>
            {/* Name */}
            <Text
              style={[styles.name, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            {/* Days badge */}
            <View
              style={[
                styles.daysBadge,
                {
                  backgroundColor: theme.primaryGlow,
                  borderColor: theme.primary + "33",
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={11}
                color={theme.primary}
                style={{ marginRight: 3 }}
              />
              <Text style={[styles.daysText, { color: theme.primary }]}>
                {item.shelf_days}d
              </Text>
            </View>

            {/* Default lock or edit/delete buttons */}
            {item.is_default ? (
              <View
                style={[
                  styles.iconBtn,
                  { backgroundColor: theme.surfaceInput },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={13}
                  color={theme.textDim}
                />
              </View>
            ) : (
              <View style={styles.actions}>
                <Pressable
                  hitSlop={10}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.surfaceInput },
                  ]}
                  onPress={() => setEditing(true)}
                  disabled={deleting}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={13}
                    color={theme.textDim}
                  />
                </Pressable>
                <Pressable
                  hitSlop={10}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.errorBg ?? theme.surfaceInput },
                  ]}
                  onPress={() => setConfirmDelete(true)}
                  disabled={deleting}
                >
                  {deleting ? (
                    <ActivityIndicator size={12} color={theme.error} />
                  ) : (
                    <Ionicons
                      name="trash-outline"
                      size={13}
                      color={theme.error}
                    />
                  )}
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    ...Shadow.sm,
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  daysBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  daysText: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editInputName: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  editInputDays: {
    width: 64,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    textAlign: "center",
  },
});
