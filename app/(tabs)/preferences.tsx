// ─────────────────────────────────────────────
//  PreferencesScreen
//  Lists all stored preference answers for the
//  authenticated user, grouped and styled by
//  category. Edit support to be hooked later.
// ─────────────────────────────────────────────

import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { usePreferences } from "@/hooks/usePreferences";
import { useTheme } from "@/hooks/useTheme";
import { Preference } from "@/lib/preference.service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Format date ──────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Delete confirmation modal ────────────────

type DeleteModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
};

function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
  deleting,
}: DeleteModalProps) {
  const theme = useTheme();
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalBackdrop} onPress={onCancel}>
        <Pressable
          style={[
            styles.modalBox,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          // stop backdrop press from bubbling through the box
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              styles.modalIconWrap,
              { backgroundColor: theme.errorBg ?? "#ffeaea" },
            ]}
          >
            <Ionicons name="trash-outline" size={24} color={theme.error} />
          </View>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Remove preference
          </Text>
          <Text style={[styles.modalBody, { color: theme.textMuted }]}>
            Are you sure you want to delete this preference? This cannot be
            undone.
          </Text>
          <View style={styles.modalActions}>
            <Pressable
              onPress={onCancel}
              disabled={deleting}
              style={[
                styles.modalBtn,
                {
                  backgroundColor: theme.surfaceInput,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.modalBtnText, { color: theme.text }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={deleting}
              style={[
                styles.modalBtn,
                styles.modalBtnDestructive,
                { backgroundColor: theme.error },
              ]}
            >
              {deleting ? (
                <ActivityIndicator size={14} color="#fff" />
              ) : (
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  Delete
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Preference card ──────────────────────────

type CardProps = {
  item: Preference;
  index: number;
  onEdit: (id: string, answer: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function PreferenceCard({ item, index, onEdit, onDelete }: CardProps) {
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

  const handleDelete = () => {
    setConfirmDelete(true);
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
          <View style={styles.cardActions}>
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
              onPress={handleDelete}
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
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
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
                  styles.cancelBtn,
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

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    preferences,
    loading,
    error,
    refetch,
    updatePreference,
    deletePreference,
  } = usePreferences();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerInner}>
          <View
            style={[styles.headerIcon, { backgroundColor: theme.primaryGlow }]}
          >
            <Ionicons name="sparkles-outline" size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Your Preferences
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
              Answers Smartory has learned about you
            </Text>
          </View>
          {preferences.length > 0 && (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: theme.primaryGlow },
              ]}
            >
              <Text style={[styles.countText, { color: theme.primary }]}>
                {preferences.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Body */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Loading preferences…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <View
            style={[
              styles.stateIcon,
              { backgroundColor: theme.errorBg, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={theme.error}
            />
          </View>
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Couldn't load preferences
          </Text>
          <Text style={[styles.stateSubtitle, { color: theme.textMuted }]}>
            {error}
          </Text>
          <Pressable
            onPress={refetch}
            style={[
              styles.retryBtn,
              {
                backgroundColor: theme.primaryGlow,
                borderColor: theme.primary + "44",
              },
            ]}
          >
            <Ionicons name="refresh-outline" size={15} color={theme.primary} />
            <Text style={[styles.retryText, { color: theme.primary }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.list,
            preferences.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {preferences.length === 0 ? (
            <View style={styles.center}>
              <View
                style={[
                  styles.stateIcon,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={36}
                  color={theme.textDim}
                />
              </View>
              <Text style={[styles.stateTitle, { color: theme.text }]}>
                No preferences yet
              </Text>
              <Text style={[styles.stateSubtitle, { color: theme.textMuted }]}>
                Answer questions on the Home screen and your choices will appear
                here.
              </Text>
            </View>
          ) : (
            preferences.map((pref, i) => (
              <PreferenceCard
                key={pref.id}
                item={pref}
                index={i}
                onEdit={updatePreference}
                onDelete={deletePreference}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },

  // Body states
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.size.sm,
    marginTop: Spacing.sm,
  },
  stateIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  stateTitle: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    textAlign: "center",
  },
  stateSubtitle: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  retryText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },

  // List
  list: {
    padding: Spacing.screenPadding,
    gap: Spacing.md,
  },
  listEmpty: {
    flex: 1,
  },

  // Card
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
  cardActions: {
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
  saveBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
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

  // Delete confirmation modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.screenPadding,
  },
  modalBox: {
    width: "100%",
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadow.md,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    textAlign: "center",
  },
  modalBody: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnDestructive: {
    borderWidth: 0,
  },
  modalBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
});
