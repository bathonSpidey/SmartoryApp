import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
};

export function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
  deleting,
}: Props) {
  const theme = useTheme();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[
            styles.box,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: theme.errorBg ?? "#ffeaea" },
            ]}
          >
            <Ionicons name="trash-outline" size={24} color={theme.error} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Remove preference
          </Text>

          <Text style={[styles.body, { color: theme.textMuted }]}>
            Are you sure you want to delete this preference? This cannot be
            undone.
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={deleting}
              style={[
                styles.btn,
                {
                  backgroundColor: theme.surfaceInput,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: theme.text }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={deleting}
              style={[
                styles.btn,
                styles.btnDestructive,
                { backgroundColor: theme.error },
              ]}
            >
              {deleting ? (
                <ActivityIndicator size={14} color="#fff" />
              ) : (
                <Text style={[styles.btnText, { color: "#fff" }]}>Delete</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.screenPadding,
  },
  box: {
    width: "100%",
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadow.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    width: "100%",
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDestructive: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
});
