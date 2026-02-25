import AgentConfigModal from "@/components/agents/AgentConfigModal";
import AgentsGrid from "@/components/agents/AgentsGrid";
import { AgentConfig } from "@/components/agents/types";
import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import {
  AGENT_META,
  AgentType,
  ALL_AGENT_TYPES,
  fetchAgentConfigs,
} from "@/lib/agents.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
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

type LoadState = "idle" | "loading" | "success" | "error";

export default function AgentsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { session } = useSession();

  const [configs, setConfigs] = useState<Partial<Record<string, AgentConfig>>>(
    {},
  );
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // ── Modal state ──
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAgentType, setModalAgentType] = useState<AgentType>("extractor");
  const [modalInitialConfig, setModalInitialConfig] = useState<
    AgentConfig | undefined
  >(undefined);

  const loadConfigs = useCallback(
    async (silent = false) => {
      if (!session?.access_token) return;
      if (!silent) setLoadState("loading");

      try {
        const result = await fetchAgentConfigs(session.access_token);
        setConfigs(result.data ?? {});
        setLoadState("success");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
        setLoadState("error");
      }
    },
    [session?.access_token],
  );

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConfigs(true);
    setRefreshing(false);
  }, [loadConfigs]);

  const openModal = useCallback((agentType: string, config?: AgentConfig) => {
    setModalAgentType(agentType as AgentType);
    setModalInitialConfig(config);
    setModalVisible(true);
  }, []);

  const handleConfigure = useCallback(
    (agentType: string) => openModal(agentType),
    [openModal],
  );

  const handleUpdate = useCallback(
    (agentType: string, config: AgentConfig) => openModal(agentType, config),
    [openModal],
  );

  // Build grid items from canonical type list
  const gridItems = ALL_AGENT_TYPES.map((type) => ({
    agentType: type,
    meta: AGENT_META[type],
    config: configs[type],
  }));

  const configuredCount = gridItems.filter((i) => !!i.config).length;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      {/* ── Config Modal ── */}
      {session?.access_token && (
        <AgentConfigModal
          visible={modalVisible}
          agentType={modalAgentType}
          initialConfig={modalInitialConfig}
          token={session.access_token}
          theme={theme}
          onClose={() => setModalVisible(false)}
          onSaved={() => {
            setModalVisible(false);
            loadConfigs(true);
          }}
        />
      )}
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.border,
            backgroundColor: theme.surface,
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            Configure Agents
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {loadState === "success"
              ? `${configuredCount} of ${ALL_AGENT_TYPES.length} active`
              : "Manage your AI agents"}
          </Text>
        </View>
        <Pressable
          onPress={() => loadConfigs()}
          style={[
            styles.refreshBtn,
            { backgroundColor: theme.surfaceElevated },
          ]}
        >
          <Ionicons name="refresh-outline" size={18} color={theme.textMuted} />
        </Pressable>
      </View>

      {/* ── Body ── */}
      {loadState === "loading" ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Waking up your bots…
          </Text>
        </View>
      ) : loadState === "error" ? (
        <ErrorState
          message={errorMsg}
          theme={theme}
          onRetry={() => loadConfigs()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          <AgentsGrid
            items={gridItems}
            theme={theme}
            onConfigure={handleConfigure}
            onUpdate={handleUpdate}
          />
        </ScrollView>
      )}
    </View>
  );
}

// ── Error state component ─────────────────────────
function ErrorState({
  message,
  theme,
  onRetry,
}: {
  message: string;
  theme: ReturnType<typeof useTheme>;
  onRetry: () => void;
}) {
  return (
    <View style={styles.centered}>
      <View
        style={[
          styles.errorIcon,
          { backgroundColor: theme.errorBg, borderColor: theme.error },
        ]}
      >
        <Ionicons name="warning-outline" size={32} color={theme.error} />
      </View>
      <Text style={[styles.errorTitle, { color: theme.text }]}>
        Could not load agents
      </Text>
      <Text style={[styles.errorMsg, { color: theme.textMuted }]}>
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        style={[styles.retryBtn, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.retryText, { color: theme.textInverse }]}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: Typography.size.xl, fontWeight: "700" },
  subtitle: { fontSize: Typography.size.sm, marginTop: 2 },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing["4xl"],
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing["4xl"],
  },
  loadingText: { fontSize: Typography.size.sm, marginTop: Spacing.sm },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  errorTitle: { fontSize: Typography.size.md, fontWeight: "700" },
  errorMsg: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  retryText: { fontSize: Typography.size.sm, fontWeight: "700" },
});
