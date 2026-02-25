import {
  Colors,
  Radius,
  Spacing,
  ThemeDark,
  Typography,
} from "@/constants/Themes";
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

  const displayName = userEmail ? userEmail.split("@")[0] : "there";
  const initial = displayName.charAt(0).toUpperCase();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Brand row */}
      <View style={styles.brandRow}>
        <View style={styles.logoMark}>
          <Ionicons name="layers" size={18} color={ThemeDark.primary} />
        </View>
        <Text style={styles.brandName}>Smartory</Text>
      </View>

      {/* Greeting + Actions */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>

        <View style={styles.actions}>
          {/* Notifications */}
          <Pressable style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={ThemeDark.text}
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
            style={styles.avatar}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeDark.surface,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeDark.border,
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
    backgroundColor: ThemeDark.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    color: ThemeDark.primary,
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: Typography.size.sm,
    color: ThemeDark.textMuted,
    letterSpacing: 0.2,
  },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    color: ThemeDark.text,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: ThemeDark.background,
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
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.white,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: ThemeDark.primaryDeep,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ThemeDark.primary,
  },
  avatarText: {
    fontSize: Typography.size.base,
    fontWeight: "700",
    color: ThemeDark.primary,
  },
});
