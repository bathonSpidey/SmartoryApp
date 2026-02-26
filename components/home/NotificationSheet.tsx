// ─────────────────────────────────────────────
//  NotificationSheet
//  Bottom sheet modal showing all expiry alerts
//  from the analysis response, grouped by urgency.
// ─────────────────────────────────────────────

import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  alerts: string[];
  onClose: () => void;
};

// Parse "ItemName expires on YYYY-MM-DD" from the alert strings
function parseAlert(alert: string): { name: string; dateStr: string } {
  const match = alert.match(/^(.+) expires on (\d{4}-\d{2}-\d{2})$/);
  if (match) return { name: match[1], dateStr: match[2] };
  return { name: alert, dateStr: "" };
}

function daysUntilDate(dateStr: string): number {
  if (!dateStr) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

type AlertGroup = {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  items: Array<{ name: string; dateStr: string; days: number }>;
};

function groupAlerts(alerts: string[]): AlertGroup[] {
  const parsed = alerts
    .map((a) => ({ ...parseAlert(a), days: 0 }))
    .map((a) => ({ ...a, days: daysUntilDate(a.dateStr) }))
    .sort((a, b) => a.days - b.days);

  const urgent = parsed.filter((a) => a.days <= 1);
  const soon = parsed.filter((a) => a.days > 1 && a.days <= 7);
  const later = parsed.filter((a) => a.days > 7);

  const groups: AlertGroup[] = [];

  if (urgent.length)
    groups.push({
      label: "Use Today or Tomorrow",
      color: "#991b1b",
      bgColor: "#fef2f2",
      icon: "flame",
      items: urgent,
    });
  if (soon.length)
    groups.push({
      label: "This Week",
      color: "#9a3412",
      bgColor: "#fff7ed",
      icon: "time",
      items: soon,
    });
  if (later.length)
    groups.push({
      label: "Coming Up",
      color: "#1d4ed8",
      bgColor: "#eff6ff",
      icon: "calendar",
      items: later,
    });

  return groups;
}

export default function NotificationSheet({ visible, alerts, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const groups = groupAlerts(alerts);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surface,
            paddingBottom: insets.bottom + Spacing.md,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle */}
        <View
          style={[styles.handle, { backgroundColor: theme.borderStrong }]}
        />

        {/* Title row */}
        <View style={styles.titleRow}>
          <Ionicons name="notifications" size={20} color={theme.warning} />
          <Text style={[styles.title, { color: theme.text }]}>
            Expiry Alerts
          </Text>
          <Text style={[styles.count, { color: theme.textMuted }]}>
            {alerts.length}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Ionicons name="close-circle" size={22} color={theme.textDim} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.lg }}
        >
          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-circle"
                size={40}
                color={theme.success}
              />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No alerts right now — your pantry is fresh!
              </Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.label}>
                {/* Group label */}
                <View style={styles.groupLabelRow}>
                  <View
                    style={[
                      styles.groupIcon,
                      { backgroundColor: group.bgColor },
                    ]}
                  >
                    <Ionicons
                      name={group.icon as any}
                      size={13}
                      color={group.color}
                    />
                  </View>
                  <Text style={[styles.groupLabel, { color: group.color }]}>
                    {group.label}
                  </Text>
                </View>

                {/* Alert rows */}
                <View
                  style={[
                    styles.groupCard,
                    {
                      backgroundColor: group.bgColor,
                      borderColor: group.color + "22",
                    },
                  ]}
                >
                  {group.items.map((item, i) => (
                    <View
                      key={item.name}
                      style={[
                        styles.alertRow,
                        i < group.items.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: group.color + "18",
                        },
                      ]}
                    >
                      <Text style={[styles.alertName, { color: group.color }]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.alertDays,
                          { color: group.color + "bb" },
                        ]}
                      >
                        {item.days <= 0
                          ? "Expired"
                          : item.days === 1
                            ? "Tomorrow"
                            : `${item.days}d`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.sm,
    maxHeight: "80%",
    ...Shadow.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: Typography.size.md,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  count: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  closeBtn: {},
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.size.base,
    textAlign: "center",
  },
  groupLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  groupIcon: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  groupLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  groupCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
  },
  alertName: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    flex: 1,
  },
  alertDays: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
