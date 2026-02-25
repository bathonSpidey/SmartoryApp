import {
  Colors,
  Radius,
  Spacing,
  ThemeDark,
  Typography,
} from "@/constants/Themes";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  danger?: boolean;
  onPress: () => void;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const userEmail = session?.user?.email ?? "";
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const [confirmVisible, setConfirmVisible] = useState(false);

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
      onPress: () => {},
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
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <Text style={styles.name}>{userEmail || "Your Account"}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.menuRow,
              index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
              pressed && styles.menuRowPressed,
            ]}
          >
            <View
              style={[styles.menuIcon, item.danger && styles.menuIconDanger]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? Colors.error : ThemeDark.textMuted}
              />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, item.danger && styles.danger]}>
                {item.label}
              </Text>
              {item.sublabel && (
                <Text style={styles.menuSublabel}>{item.sublabel}</Text>
              )}
            </View>
            {!item.danger && (
              <Ionicons
                name="chevron-forward"
                size={16}
                color={ThemeDark.textDim}
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
          pressed && styles.signOutButtonPressed,
        ]}
      >
        <View style={styles.signOutIcon}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        </View>
        <Text style={styles.signOutLabel}>Sign Out</Text>
      </Pressable>

      {/* Confirmation modal */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={28} color={Colors.error} />
            </View>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out of your account?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setConfirmVisible(false)}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.modalBtnCancel,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
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
  screen: { flex: 1, backgroundColor: ThemeDark.background },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeDark.border,
    backgroundColor: ThemeDark.surface,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    color: ThemeDark.text,
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
    backgroundColor: ThemeDark.primaryDeep,
    borderWidth: 2,
    borderColor: ThemeDark.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
    color: ThemeDark.text,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
    color: ThemeDark.primary,
  },
  menuCard: {
    marginHorizontal: Spacing.screenPadding,
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: ThemeDark.border,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: ThemeDark.border },
  menuRowPressed: { backgroundColor: ThemeDark.surfaceHover },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: ThemeDark.background,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: { backgroundColor: Colors.errorLight + "22" },
  menuText: { flex: 1, gap: 2 },
  menuLabel: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: ThemeDark.text,
  },
  menuSublabel: { fontSize: Typography.size.xs, color: ThemeDark.textMuted },
  danger: { color: Colors.error },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.md,
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.error + "55",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  signOutButtonPressed: { opacity: 0.7 },
  signOutIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.errorLight + "22",
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
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: ThemeDark.border,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.errorLight + "22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
    color: ThemeDark.text,
  },
  modalMessage: {
    fontSize: Typography.size.sm,
    color: ThemeDark.textMuted,
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
  modalBtnCancel: {
    backgroundColor: ThemeDark.background,
    borderWidth: 1,
    borderColor: ThemeDark.border,
  },
  modalBtnCancelText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: ThemeDark.text,
  },
  modalBtnConfirm: {
    backgroundColor: Colors.error,
  },
  modalBtnConfirmText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: "#fff",
  },
});
