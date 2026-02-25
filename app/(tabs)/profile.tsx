import { Colors, Radius, Spacing, Typography } from "@/constants/Themes";
import { CURRENCY_OPTIONS, CurrencyCode } from "@/constants/currencies";
import { useThemeContext, type ThemeMode } from "@/contexts/ThemeContext";
import { useSession } from "@/hooks/useSession";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  danger?: boolean;
  onPress: () => void;
};

const THEME_OPTIONS: {
  mode: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { mode: "light", label: "Light", icon: "sunny-outline" },
  { mode: "system", label: "System", icon: "phone-portrait-outline" },
  { mode: "dark", label: "Dark", icon: "moon-outline" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { theme, mode: themeMode, setMode: setThemeMode } = useThemeContext();
  const userEmail = session?.user?.email ?? "";
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const { currency: savedCurrency, update: updateCurrency } = useUserCurrency();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [currencySaved, setCurrencySaved] = useState(false);

  // Sync selected state when backend preference loads
  React.useEffect(() => {
    setSelectedCurrency(savedCurrency);
  }, [savedCurrency]);

  const handleSaveCurrency = async () => {
    setSavingCurrency(true);
    setCurrencySaved(false);
    try {
      await updateCurrency(selectedCurrency);
      setCurrencySaved(true);
      setTimeout(() => setCurrencySaved(false), 2000);
    } catch (e) {
      // silently ignore — can be replaced with a toast
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleSignOut = async () => {
    setConfirmVisible(false);
    await supabase.auth.signOut({ scope: "local" });
    // AuthGuard in _layout.tsx detects session === null and redirects
  };

  const MENU_ITEMS: MenuItem[] = [
    {
      id: "settings",
      icon: "settings-outline",
      label: "Settings",
      sublabel: "Preferences & configuration",
      onPress: () => setSettingsVisible(true),
    },
    {
      id: "help",
      icon: "help-circle-outline",
      label: "Help & Support",
      sublabel: "FAQs and contact",
      onPress: () => {},
    },
  ];

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.primaryDeep, borderColor: theme.primary },
          ]}
        >
          <Text style={[styles.avatarInitial, { color: theme.primary }]}>
            {initial}
          </Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>
          {userEmail || "Your Account"}
        </Text>
      </View>

      {/* Theme picker */}
      <View
        style={[
          styles.themeCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.themeHeader}>
          <Ionicons
            name="color-palette-outline"
            size={16}
            color={theme.textMuted}
          />
          <Text style={[styles.themeLabel, { color: theme.textMuted }]}>
            APPEARANCE
          </Text>
        </View>
        <View
          style={[styles.themeTrack, { backgroundColor: theme.surfaceSubtle }]}
        >
          {THEME_OPTIONS.map((opt) => {
            const active = themeMode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                onPress={() => setThemeMode(opt.mode)}
                style={[
                  styles.themeOption,
                  active && {
                    backgroundColor: theme.surface,
                    ...theme.shadowCard,
                  },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={active ? theme.primary : theme.textDim}
                />
                <Text
                  style={[
                    styles.themeOptionLabel,
                    { color: active ? theme.primary : theme.textDim },
                    active && { fontWeight: "700" },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Menu */}
      <View
        style={[
          styles.menuCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.menuRow,
              index < MENU_ITEMS.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
              pressed && { backgroundColor: theme.surfaceHover },
            ]}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.background },
                item.danger && { backgroundColor: Colors.error + "18" },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? Colors.error : theme.textMuted}
              />
            </View>
            <View style={styles.menuText}>
              <Text
                style={[
                  styles.menuLabel,
                  { color: theme.text },
                  item.danger && { color: Colors.error },
                ]}
              >
                {item.label}
              </Text>
              {item.sublabel && (
                <Text style={[styles.menuSublabel, { color: theme.textMuted }]}>
                  {item.sublabel}
                </Text>
              )}
            </View>
            {!item.danger && (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textDim}
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* Sign Out — standalone button */}
      <Pressable
        onPress={() => setConfirmVisible(true)}
        style={({ pressed }) => [
          styles.signOutButton,
          { backgroundColor: theme.surface, borderColor: Colors.error + "55" },
          pressed && { opacity: 0.7 },
        ]}
      >
        <View style={styles.signOutIcon}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        </View>
        <Text style={styles.signOutLabel}>Sign Out</Text>
      </Pressable>

      {/* Settings modal */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSettingsVisible(false)}
        >
          <Pressable
            style={[
              styles.settingsSheet,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <View
              style={[styles.sheetHandle, { backgroundColor: theme.border }]}
            />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                Settings
              </Text>
              <Pressable onPress={() => setSettingsVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={theme.textMuted} />
              </Pressable>
            </View>

            {/* Currency section */}
            <Text
              style={[styles.settingsSectionLabel, { color: theme.textMuted }]}
            >
              PREFERRED CURRENCY
            </Text>
            <ScrollView
              style={styles.currencyList}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {CURRENCY_OPTIONS.map((opt) => {
                const active = selectedCurrency === opt.code;
                return (
                  <Pressable
                    key={opt.code}
                    style={[
                      styles.currencyRow,
                      { borderBottomColor: theme.border },
                      active && { backgroundColor: theme.primary + "0d" },
                    ]}
                    onPress={() => setSelectedCurrency(opt.code)}
                  >
                    <View
                      style={[
                        styles.currencySymbolBox,
                        {
                          backgroundColor: active
                            ? theme.primary + "18"
                            : theme.surfaceElevated,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.currencySymbol,
                          { color: active ? theme.primary : theme.textMuted },
                        ]}
                      >
                        {opt.symbol}
                      </Text>
                    </View>
                    <View style={styles.currencyInfo}>
                      <Text
                        style={[
                          styles.currencyCode,
                          { color: theme.text },
                          active && { color: theme.primary, fontWeight: "700" },
                        ]}
                      >
                        {opt.code}
                      </Text>
                      <Text
                        style={[
                          styles.currencyLabel,
                          { color: theme.textMuted },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </View>
                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Save button */}
            <Pressable
              onPress={handleSaveCurrency}
              disabled={savingCurrency}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: currencySaved
                    ? Colors.success
                    : theme.primary,
                },
                (pressed || savingCurrency) && { opacity: 0.75 },
              ]}
            >
              {savingCurrency ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={currencySaved ? "checkmark" : "save-outline"}
                  size={16}
                  color="#fff"
                />
              )}
              <Text style={styles.saveBtnText}>
                {currencySaved ? "Saved!" : "Save Changes"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={28} color={Colors.error} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Sign Out
            </Text>
            <Text style={[styles.modalMessage, { color: theme.textMuted }]}>
              Are you sure you want to sign out of your account?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setConfirmVisible(false)}
                style={({ pressed }) => [
                  styles.modalBtn,
                  {
                    backgroundColor: theme.background,
                    borderWidth: 1,
                    borderColor: theme.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[styles.modalBtnCancelText, { color: theme.text }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSignOut}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnConfirm,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.modalBtnConfirmText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
  },
  // ── Theme picker ────────────────────────────
  themeCard: {
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  themeLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  themeTrack: {
    flexDirection: "row",
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: Radius.sm,
  },
  themeOptionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  // ── Menu ────────────────────────────────────
  menuCard: {
    marginHorizontal: Spacing.screenPadding,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1, gap: 2 },
  menuLabel: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  menuSublabel: { fontSize: Typography.size.xs },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  signOutIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.error + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutLabel: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.screenPadding,
  },
  modalCard: {
    width: "100%",
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.error + "18",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
  },
  modalMessage: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: "center",
  },
  modalBtnCancelText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  modalBtnConfirm: {
    backgroundColor: Colors.error,
  },
  modalBtnConfirmText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: "#fff",
  },
  // ── Settings sheet ─────────────────────────
  settingsSheet: {
    marginTop: "auto",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: "80%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: Spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontSize: Typography.size.lg,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  settingsSectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginBottom: Spacing.sm,
  },
  currencyList: {
    flexGrow: 0,
    maxHeight: 320,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
  },
  currencySymbolBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
  currencyInfo: { flex: 1, gap: 1 },
  currencyCode: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  currencyLabel: {
    fontSize: Typography.size.xs,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.lg,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: Typography.size.sm,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
