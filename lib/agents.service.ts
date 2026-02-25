// ─────────────────────────────────────────────
//  Smartory — Agents Service
//  Fetches & manages agent configurations
// ─────────────────────────────────────────────

const BASE_URL = "http://127.0.0.1:8000";

export type AgentType =
  | "extractor"
  | "recommender"
  | "planner"
  | "budget_watcher";

export type AgentConfig = {
  api_key: string;
  agent_type: string;
  model_name: string;
  temperature: number;
  provider_name: string;
};

export type AgentConfigsResponse = {
  status: string;
  data: Partial<Record<AgentType, AgentConfig>>;
};

export const ALL_AGENT_TYPES: AgentType[] = [
  "extractor",
  "recommender",
  "planner",
  "budget_watcher",
];

export const AGENT_META: Record<
  AgentType,
  { label: string; description: string; accentHex: string }
> = {
  extractor: {
    label: "Extractor",
    description: "Pulls structured data from receipts & documents",
    accentHex: "#0d9488",
  },
  recommender: {
    label: "Recommender",
    description: "Suggests restocks based on usage patterns",
    accentHex: "#7c3aed",
  },
  planner: {
    label: "Planner",
    description: "Creates shopping lists & purchase plans",
    accentHex: "#d97706",
  },
  budget_watcher: {
    label: "Budget Watcher",
    description: "Monitors spend and flags overruns",
    accentHex: "#dc2626",
  },
};

export async function fetchAgentConfigs(
  token: string,
): Promise<AgentConfigsResponse> {
  const response = await fetch(`${BASE_URL}/agents/configs`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch agent configs: HTTP ${response.status}`);
  }

  return response.json();
}
