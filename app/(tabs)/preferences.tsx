// ─────────────────────────────────────────────
//  PreferencesScreen
// ─────────────────────────────────────────────

import { PreferenceCard } from "@/components/preferences/PreferenceCard";
import { Radius, Spacing, Typography } from "@/constants/Themes";
import { usePreferences } from "@/hooks/usePreferences";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  list: {
    padding: Spacing.screenPadding,
    gap: Spacing.md,
  },
  listEmpty: {
    flex: 1,
  },
});
