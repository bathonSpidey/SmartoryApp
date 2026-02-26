import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Preference } from "@/lib/preference.service";
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
import { formatDate } from "./dateUtils";

type Props = {
  item: Preference;
  index: number;
  onEdit: (id: string, answer: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function PreferenceCard({ item, index, onEdit, onDelete }: Props) {
  const theme = useTheme();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(item.answer);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSave = async () => {
    if (!draft.trim() || draft.trim() === item.answer) {
      setEditing(false);
      setDraft(item.answer);
      return;
    }
    setSaving(true);
    try {
      await onEdit(item.id, draft.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(item.answer);
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
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            opacity: deleting ? 0.5 : 1,
          },
        ]}
      >
        {/* Index badge + question */}
        <View style={styles.cardTop}>
          <View
            style={[styles.indexBadge, { backgroundColor: theme.primaryGlow }]}
          >
            <Text style={[styles.indexText, { color: theme.primary }]}>
              {index + 1}
            </Text>
          </View>

          <Text
            style={[styles.question, { color: theme.text }]}
            numberOfLines={3}
          >
            {item.question}
          </Text>

          {/* Edit / delete buttons */}
          <View style={styles.actions}>
            {!editing && (
              <Pressable
                hitSlop={10}
                style={[
                  styles.actionBtn,
                  { backgroundColor: theme.surfaceInput },
                ]}
                onPress={() => setEditing(true)}
                disabled={deleting}
              >
                <Ionicons
                  name="pencil-outline"
                  size={14}
                  color={theme.textDim}
                />
              </Pressable>
            )}
            <Pressable
              hitSlop={10}
              style={[
                styles.actionBtn,
                { backgroundColor: theme.errorBg ?? theme.surfaceInput },
              ]}
              onPress={() => setConfirmDelete(true)}
              disabled={deleting || editing}
            >
              {deleting ? (
                <ActivityIndicator size={12} color={theme.error} />
              ) : (
                <Ionicons name="trash-outline" size={14} color={theme.error} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Answer row */}
        <View style={styles.cardBottom}>
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={[
                  styles.editInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.surfaceInput,
                    borderColor: theme.primary + "66",
                  },
                ]}
                value={draft}
                onChangeText={setDraft}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
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
                style={[
                  styles.actionBtn,
                  { backgroundColor: theme.surfaceInput },
                ]}
              >
                <Ionicons name="close" size={14} color={theme.textDim} />
              </Pressable>
            </View>
          ) : (
            <View
              style={[
                styles.answerChip,
                {
                  backgroundColor: theme.primaryGlow,
                  borderColor: theme.primary + "33",
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={theme.primary}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.answerText, { color: theme.primary }]}>
                {item.answer}
              </Text>
            </View>
          )}

          {!editing && (
            <Text style={[styles.date, { color: theme.textDim }]}>
              {formatDate(item.created_at)}
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...Shadow.sm,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  indexText: {
    fontSize: Typography.size.xs,
    fontWeight: "800",
  },
  question: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    lineHeight: 20,
    paddingTop: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    flexShrink: 0,
    marginTop: 2,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  editRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editInput: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  answerChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexShrink: 1,
  },
  answerText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
    flexShrink: 1,
  },
  date: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
    flexShrink: 0,
  },
});
