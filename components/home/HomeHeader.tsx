import { Colors, Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  userEmail?: string;
  notificationCount?: number;
};

export default function HomeHeader({
  userEmail = "",
  notificationCount = 3,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const displayName = userEmail ? userEmail.split("@")[0] : "there";
  const initial = displayName.charAt(0).toUpperCase();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {/* Brand row */}
      <View style={styles.brandRow}>
        <View style={[styles.logoMark, { backgroundColor: theme.primaryGlow }]}>
          <Ionicons name="layers" size={18} color={theme.primary} />
        </View>
        <Text style={[styles.brandName, { color: theme.primary }]}>
          Smartory
        </Text>
      </View>

      {/* Greeting + Actions */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={[styles.greeting, { color: theme.textMuted }]}>
            {greeting},
          </Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {displayName}
          </Text>
        </View>

        <View style={styles.actions}>
          {/* Notifications */}
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.background }]}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.text}
            />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Avatar */}
          <Pressable
            style={[
              styles.avatar,
              {
                backgroundColor: theme.primaryDeep,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {initial}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: { fontSize: Typography.size.sm, letterSpacing: 0.2 },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: Colors.white },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarText: { fontSize: Typography.size.base, fontWeight: "700" },
});
