// ─────────────────────────────────────────────
//  PreferencesScreen
// ─────────────────────────────────────────────

import { AddCategoryModal } from "@/components/preferences/AddCategoryModal";
import { CategoryCard } from "@/components/preferences/CategoryCard";
import { PreferenceCard } from "@/components/preferences/PreferenceCard";
import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useCategories } from "@/hooks/useCategories";
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
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const {
    preferences,
    loading: prefLoading,
    error: prefError,
    refetch: refetchPrefs,
    updatePreference,
    deletePreference,
  } = usePreferences();

  const {
    categories,
    loading: catLoading,
    error: catError,
    refetch: refetchCats,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const { width } = useWindowDimensions();
  const pagerRef = React.useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [addCatVisible, setAddCatVisible] = React.useState(false);

  // ── Category search & sort ───────────────────
  const [catSearch, setCatSearch] = React.useState("");
  const [catSortDir, setCatSortDir] = React.useState<"asc" | "desc">("asc");

  const filteredCategories = React.useMemo(() => {
    let list = [...categories];
    if (catSearch.trim()) {
      const q = catSearch.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    list.sort((a, b) =>
      catSortDir === "asc"
        ? a.shelf_days - b.shelf_days
        : b.shelf_days - a.shelf_days,
    );
    return list;
  }, [categories, catSearch, catSortDir]);

  const switchTab = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPrefs(), refetchCats()]);
    setRefreshing(false);
  };

  const isLoading = (prefLoading || catLoading) && !refreshing;
  const topError = prefError || catError;

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
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
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
              Preferences
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
              Your answers &amp; food categories
            </Text>
          </View>
        </View>
      </View>

      <AddCategoryModal
        visible={addCatVisible}
        onClose={() => setAddCatVisible(false)}
        onAdd={addCategory}
      />

      {/* Body */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Loading…
          </Text>
        </View>
      ) : topError ? (
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
            Couldn't load data
          </Text>
          <Text style={[styles.stateSubtitle, { color: theme.textMuted }]}>
            {topError}
          </Text>
          <Pressable
            onPress={handleRefresh}
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
        <>
          {/* ── Tab bar ──────────────────────────────── */}
          <View
            style={[
              styles.tabBar,
              {
                backgroundColor: theme.surface,
                borderBottomColor: theme.border,
              },
            ]}
          >
            {/* Answers tab */}
            <Pressable
              style={[styles.tab, activeTab === 0 && styles.tabActive]}
              onPress={() => switchTab(0)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={14}
                color={activeTab === 0 ? theme.primary : theme.textDim}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 0 ? theme.primary : theme.textDim,
                    fontWeight: activeTab === 0 ? "700" : "500",
                  },
                ]}
              >
                Your Answers
              </Text>
              {preferences.length > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor:
                        activeTab === 0 ? theme.primary : theme.surfaceInput,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      { color: activeTab === 0 ? "#fff" : theme.textDim },
                    ]}
                  >
                    {preferences.length}
                  </Text>
                </View>
              )}
              {activeTab === 0 && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: theme.primary },
                  ]}
                />
              )}
            </Pressable>

            {/* Divider */}
            <View
              style={[styles.tabDivider, { backgroundColor: theme.border }]}
            />

            {/* Categories tab */}
            <Pressable
              style={[styles.tab, activeTab === 1 && styles.tabActive]}
              onPress={() => switchTab(1)}
            >
              <Ionicons
                name="pricetag-outline"
                size={14}
                color={activeTab === 1 ? theme.primary : theme.textDim}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === 1 ? theme.primary : theme.textDim,
                    fontWeight: activeTab === 1 ? "700" : "500",
                  },
                ]}
              >
                Food Categories
              </Text>
              {categories.length > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor:
                        activeTab === 1 ? theme.primary : theme.surfaceInput,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      { color: activeTab === 1 ? "#fff" : theme.textDim },
                    ]}
                  >
                    {categories.length}
                  </Text>
                </View>
              )}
              {activeTab === 1 && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: theme.primary },
                  ]}
                />
              )}
            </Pressable>
          </View>

          {/* ── Pager ────────────────────────────────── */}
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveTab(page);
            }}
            onScrollEndDrag={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveTab(page);
            }}
            style={styles.pager}
          >
            {/* Page 0 — Your Answers */}
            <ScrollView
              style={{ width }}
              contentContainerStyle={styles.pageContent}
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
                <View
                  style={[
                    styles.emptyBox,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={28}
                    color={theme.textDim}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={[styles.emptyText, { color: theme.textDim }]}>
                    Answer questions on the Home screen and your choices will
                    appear here.
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
              <View style={{ height: Spacing.xl }} />
            </ScrollView>

            {/* Page 1 — Food Categories */}
            <ScrollView
              style={{ width }}
              contentContainerStyle={styles.pageContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={theme.primary}
                />
              }
            >
              {/* Top-centre add button */}
              <Pressable
                onPress={() => setAddCatVisible(true)}
                style={[styles.topAddBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.topAddBtnText}>Add Category</Text>
              </Pressable>

              {/* Search + sort toolbar */}
              {categories.length > 0 && (
                <View style={styles.toolbar}>
                  {/* Search input */}
                  <View
                    style={[
                      styles.searchBox,
                      {
                        backgroundColor: theme.surfaceInput,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="search-outline"
                      size={15}
                      color={theme.textDim}
                    />
                    <TextInput
                      style={[styles.searchInput, { color: theme.text }]}
                      placeholder="Search categories…"
                      placeholderTextColor={theme.textDim}
                      value={catSearch}
                      onChangeText={setCatSearch}
                      returnKeyType="search"
                      clearButtonMode="while-editing"
                    />
                    {catSearch.length > 0 && (
                      <Pressable onPress={() => setCatSearch("")} hitSlop={8}>
                        <Ionicons
                          name="close-circle"
                          size={15}
                          color={theme.textDim}
                        />
                      </Pressable>
                    )}
                  </View>

                  {/* Sort chips */}
                  <View style={styles.sortRow}>
                    <Pressable
                      onPress={() => setCatSortDir("asc")}
                      style={[
                        styles.sortChip,
                        {
                          backgroundColor:
                            catSortDir === "asc"
                              ? theme.primary
                              : theme.surfaceInput,
                          borderColor:
                            catSortDir === "asc" ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="arrow-up"
                        size={12}
                        color={catSortDir === "asc" ? "#fff" : theme.textDim}
                      />
                      <Text
                        style={[
                          styles.sortChipText,
                          {
                            color:
                              catSortDir === "asc" ? "#fff" : theme.textDim,
                          },
                        ]}
                      >
                        Days
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setCatSortDir("desc")}
                      style={[
                        styles.sortChip,
                        {
                          backgroundColor:
                            catSortDir === "desc"
                              ? theme.primary
                              : theme.surfaceInput,
                          borderColor:
                            catSortDir === "desc"
                              ? theme.primary
                              : theme.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="arrow-down"
                        size={12}
                        color={catSortDir === "desc" ? "#fff" : theme.textDim}
                      />
                      <Text
                        style={[
                          styles.sortChipText,
                          {
                            color:
                              catSortDir === "desc" ? "#fff" : theme.textDim,
                          },
                        ]}
                      >
                        Days
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {categories.length === 0 ? (
                <View
                  style={[
                    styles.emptyBox,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={28}
                    color={theme.textDim}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={[styles.emptyText, { color: theme.textDim }]}>
                    No categories yet. Tap "Add" above to create your first one.
                  </Text>
                </View>
              ) : filteredCategories.length === 0 ? (
                <View
                  style={[
                    styles.emptyBox,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={28}
                    color={theme.textDim}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={[styles.emptyText, { color: theme.textDim }]}>
                    No categories match "{catSearch}".
                  </Text>
                </View>
              ) : (
                filteredCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    item={cat}
                    onEdit={editCategory}
                    onDelete={removeCategory}
                  />
                ))
              )}
              <View style={{ height: Spacing.xl }} />
            </ScrollView>
          </ScrollView>

          {/* FAB — bottom right, categories tab only */}
          {activeTab === 1 && (
            <Pressable
              onPress={() => setAddCatVisible(true)}
              style={[
                styles.fab,
                {
                  backgroundColor: theme.primary,
                  bottom: insets.bottom + 20,
                },
              ]}
            >
              <Ionicons name="add" size={26} color="#fff" />
            </Pressable>
          )}
        </>
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

  // ── Tab bar ──────────────────────────────────
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    position: "relative",
  },
  tabActive: {},
  tabLabel: {
    fontSize: Typography.size.sm,
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: Spacing.md,
    right: Spacing.md,
    height: 2,
    borderRadius: 2,
  },
  tabDivider: {
    width: 1,
    marginVertical: 10,
  },

  // ── Pager ────────────────────────────────────
  pager: {
    flex: 1,
  },
  pageContent: {
    padding: Spacing.screenPadding,
    gap: Spacing.md,
  },

  // ── Search + sort toolbar ────────────────────
  toolbar: {
    gap: Spacing.sm,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.size.sm,
    fontWeight: "500",
    padding: 0,
  },
  sortRow: {
    flexDirection: "row",
    gap: 8,
  },
  sortChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
  },

  // Top-centre add pill
  topAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  topAddBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
    color: "#fff",
  },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // ── Empty states ─────────────────────────────
  emptyBox: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
    gap: 4,
  },
  emptyText: {
    fontSize: Typography.size.sm,
    lineHeight: 20,
    textAlign: "center",
  },
});
