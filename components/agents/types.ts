// ─────────────────────────────────────────────
//  Shared types for the Agents feature
// ─────────────────────────────────────────────

export type AgentConfig = {
  api_key: string;
  agent_type: string;
  model_name: string;
  temperature: number;
  provider_name: string;
};

export type AgentMeta = {
  label: string;
  description: string;
  accentHex: string;
};
