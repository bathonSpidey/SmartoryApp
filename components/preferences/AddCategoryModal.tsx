import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { CategoryCreatePayload } from "@/lib/categories.service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (payload: CategoryCreatePayload) => Promise<void>;
};

export function AddCategoryModal({ visible, onClose, onAdd }: Props) {
  const theme = useTheme();
  const [name, setName] = React.useState("");
  const [shelfDays, setShelfDays] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [nameError, setNameError] = React.useState("");
  const [daysError, setDaysError] = React.useState("");

  const handleClose = () => {
    if (saving) return;
    setName("");
    setShelfDays("");
    setNameError("");
    setDaysError("");
    onClose();
  };

  const validate = (): boolean => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }
    const parsed = parseInt(shelfDays, 10);
    if (!shelfDays || isNaN(parsed) || parsed < 1) {
      setDaysError("Enter a valid number of days (≥ 1)");
      valid = false;
    } else {
      setDaysError("");
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onAdd({ name: name.trim(), shelf_days: parseInt(shelfDays, 10) });
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.kav}
        >
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.primaryGlow },
                ]}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color={theme.primary}
                />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                New Category
              </Text>
              <Pressable onPress={handleClose} hitSlop={10} disabled={saving}>
                <Ionicons
                  name="close-circle-outline"
                  size={22}
                  color={theme.textDim}
                />
              </Pressable>
            </View>

            {/* Name field */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                Category name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.surfaceInput,
                    borderColor: nameError ? theme.error : theme.primary + "55",
                  },
                ]}
                placeholder="e.g. Dairy"
                placeholderTextColor={theme.textDim}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (nameError) setNameError("");
                }}
                autoFocus
                returnKeyType="next"
                editable={!saving}
              />
              {!!nameError && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {nameError}
                </Text>
              )}
            </View>

            {/* Shelf days field */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textMuted }]}>
                Shelf life (days)
              </Text>
              <View style={styles.daysRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.daysInput,
                    {
                      color: theme.text,
                      backgroundColor: theme.surfaceInput,
                      borderColor: daysError
                        ? theme.error
                        : theme.primary + "55",
                    },
                  ]}
                  placeholder="e.g. 7"
                  placeholderTextColor={theme.textDim}
                  value={shelfDays}
                  onChangeText={(t) => {
                    setShelfDays(t.replace(/[^0-9]/g, ""));
                    if (daysError) setDaysError("");
                  }}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  editable={!saving}
                />
                <Text style={[styles.daysUnit, { color: theme.textDim }]}>
                  days
                </Text>
              </View>
              {!!daysError && (
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {daysError}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                onPress={handleClose}
                disabled={saving}
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
                onPress={handleSubmit}
                disabled={saving}
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  { backgroundColor: theme.primary },
                ]}
              >
                {saving ? (
                  <ActivityIndicator size={16} color="#fff" />
                ) : (
                  <>
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={[styles.btnText, { color: "#fff" }]}>Add</Text>
                  </>
                )}
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  kav: {
    width: "100%",
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.lg,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: Typography.size.md,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  daysInput: {
    flex: 1,
  },
  daysUnit: {
    fontSize: Typography.size.sm,
    fontWeight: "500",
  },
  errorText: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  btnPrimary: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
});
