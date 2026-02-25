// ─────────────────────────────────────────────
//  AgentConfigModal
//  Slide-up sheet for creating / updating an
//  agent configuration via PUT /agents/configure
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import {
  AgentType,
  ALL_PROVIDERS,
  configureAgent,
  ConfigureAgentPayload,
  MODELS_BY_PROVIDER,
  ProviderName,
} from "@/lib/agents.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AgentConfig } from "./types";

// ─── Props ────────────────────────────────────
type Props = {
  visible: boolean;
  agentType: AgentType;
  initialConfig?: AgentConfig;
  token: string;
  theme: SemanticTheme;
  onClose: () => void;
  onSaved: () => void;
};

// ─── Internal form state ─────────────────────
type FormState = {
  provider_name: ProviderName;
  model_name: string;
  api_key: string;
  temperature: string; // kept as string for TextInput
};

function buildInitialForm(
  agentType: AgentType,
  config?: AgentConfig,
): FormState {
  const provider =
    (config?.provider_name as ProviderName | undefined) ?? ALL_PROVIDERS[0];
  return {
    provider_name: provider,
    model_name: config?.model_name ?? MODELS_BY_PROVIDER[provider][0],
    api_key: config?.api_key ?? "",
    temperature: config !== undefined ? String(config.temperature) : "0.5",
  };
}

// ─── Component ────────────────────────────────
export default function AgentConfigModal({
  visible,
  agentType,
  initialConfig,
  token,
  theme,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(agentType, initialConfig),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // Keep open dropdown id: null | "provider" | "agent_type" | "model"
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Reset form whenever modal opens
  useEffect(() => {
    if (visible) {
      setForm(buildInitialForm(agentType, initialConfig));
      setError("");
      setOpenDropdown(null);
    }
  }, [visible, agentType, initialConfig]);

  // When provider changes, reset model to first available
  function handleProviderChange(p: ProviderName) {
    setForm((f) => ({
      ...f,
      provider_name: p,
      model_name: MODELS_BY_PROVIDER[p][0],
    }));
  }

  async function handleSave() {
    const temp = parseFloat(form.temperature);
    if (isNaN(temp) || temp < 0 || temp > 1) {
      setError("Temperature must be a number between 0 and 1.");
      return;
    }
    if (!form.api_key.trim()) {
      setError("API key is required.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const payload: ConfigureAgentPayload = {
        provider_name: form.provider_name,
        agent_type: agentType,
        model_name: form.model_name,
        api_key: form.api_key.trim(),
        temperature: temp,
      };
      await configureAgent(token, payload);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const agentTypeLabel = agentType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Dim overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.kvWrapper, { pointerEvents: "box-none" }]}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              ...theme.shadowPrimary,
            },
          ]}
        >
          {/* ── Handle ── */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* ── Header ── */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                Configure Agent
              </Text>
              <Text style={[styles.sheetSubtitle, { color: theme.textMuted }]}>
                {agentTypeLabel}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: theme.surfaceElevated },
              ]}
            >
              <Ionicons name="close" size={18} color={theme.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Provider ── */}
            <DropdownField
              label="Provider"
              id="provider"
              value={form.provider_name}
              options={ALL_PROVIDERS}
              openId={openDropdown}
              onToggle={(id) =>
                setOpenDropdown((prev) => (prev === id ? null : id))
              }
              onSelect={(v) => {
                handleProviderChange(v as ProviderName);
                setOpenDropdown(null);
              }}
              theme={theme}
            />

            {/* ── Model ── */}
            <DropdownField
              label="Model"
              id="model"
              value={form.model_name}
              options={MODELS_BY_PROVIDER[form.provider_name]}
              openId={openDropdown}
              onToggle={(id) =>
                setOpenDropdown((prev) => (prev === id ? null : id))
              }
              onSelect={(v) => {
                setForm((f) => ({ ...f, model_name: v }));
                setOpenDropdown(null);
              }}
              theme={theme}
            />

            {/* ── Agent Type (read-only badge) ── */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
                Agent Type
              </Text>
              <View
                style={[
                  styles.readonlyBadge,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="hardware-chip-outline"
                  size={14}
                  color={theme.textDim}
                />
                <Text style={[styles.readonlyText, { color: theme.textDim }]}>
                  {agentTypeLabel}
                </Text>
              </View>
            </View>

            {/* ── API Key ── */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
                API Key
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surfaceInput,
                    borderColor: error.toLowerCase().includes("api")
                      ? theme.error
                      : theme.border,
                    color: theme.text,
                  },
                ]}
                value={form.api_key}
                onChangeText={(v) => setForm((f) => ({ ...f, api_key: v }))}
                placeholder="Enter your API key"
                placeholderTextColor={theme.textDim}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>

            {/* ── Temperature ── */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
                  Temperature
                </Text>
                <Text style={[styles.fieldHint, { color: theme.textDim }]}>
                  0 – 1
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.surfaceInput,
                    borderColor: error.toLowerCase().includes("temperature")
                      ? theme.error
                      : theme.border,
                    color: theme.text,
                  },
                ]}
                value={form.temperature}
                onChangeText={(v) => setForm((f) => ({ ...f, temperature: v }))}
                placeholder="e.g. 0.5"
                placeholderTextColor={theme.textDim}
                keyboardType="decimal-pad"
              />
            </View>

            {/* ── Error ── */}
            {!!error && (
              <View
                style={[
                  styles.errorBanner,
                  {
                    backgroundColor: theme.errorBg,
                    borderColor: theme.error,
                  },
                ]}
              >
                <Ionicons
                  name="warning-outline"
                  size={14}
                  color={theme.error}
                />
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {error}
                </Text>
              </View>
            )}

            {/* ── Action buttons ── */}
            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                style={[
                  styles.cancelBtn,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.cancelText, { color: theme.textMuted }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={({ pressed }) => [
                  styles.saveBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: pressed || saving ? 0.7 : 1,
                    ...theme.shadowPrimary,
                  },
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.saveText}>Save</Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Dropdown field component ─────────────────
function DropdownField({
  label,
  id,
  value,
  options,
  openId,
  onToggle,
  onSelect,
  theme,
}: {
  label: string;
  id: string;
  value: string;
  options: string[];
  openId: string | null;
  onToggle: (id: string) => void;
  onSelect: (value: string) => void;
  theme: SemanticTheme;
}) {
  const isOpen = openId === id;

  return (
    <View style={[styles.fieldGroup, isOpen && { zIndex: 10 }]}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      <Pressable
        onPress={() => onToggle(id)}
        style={[
          styles.dropdownTrigger,
          {
            backgroundColor: theme.surfaceInput,
            borderColor: isOpen ? theme.borderFocus : theme.border,
          },
        ]}
      >
        <Text
          style={[styles.dropdownValue, { color: theme.text }]}
          numberOfLines={1}
        >
          {value}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={theme.textMuted}
        />
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.dropdownList,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderFocus,
              ...theme.shadowCard,
            },
          ]}
        >
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => onSelect(opt)}
              style={({ pressed }) => [
                styles.dropdownOption,
                {
                  backgroundColor:
                    opt === value
                      ? theme.primaryDim
                      : pressed
                        ? theme.surfaceHover
                        : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  {
                    color: opt === value ? theme.primaryText : theme.text,
                    fontWeight: opt === value ? "700" : "400",
                  },
                ]}
              >
                {opt}
              </Text>
              {opt === value && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={theme.primaryText}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  kvWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  sheetTitle: { fontSize: Typography.size.lg, fontWeight: "700" },
  sheetSubtitle: { fontSize: Typography.size.sm, marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  formScroll: { flexShrink: 1 },
  formContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldHint: { fontSize: Typography.size.xs },
  textInput: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: Typography.size.sm,
  },
  readonlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  readonlyText: { fontSize: Typography.size.sm },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
  },
  dropdownValue: { fontSize: Typography.size.sm, flex: 1 },
  dropdownList: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    overflow: "hidden",
    marginTop: 2,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
  },
  dropdownOptionText: { fontSize: Typography.size.sm },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  errorText: { fontSize: Typography.size.xs, flex: 1, lineHeight: 18 },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: Typography.size.sm, fontWeight: "600" },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: Radius.full,
    paddingVertical: 13,
  },
  saveText: { fontSize: Typography.size.sm, fontWeight: "700", color: "#fff" },
});
