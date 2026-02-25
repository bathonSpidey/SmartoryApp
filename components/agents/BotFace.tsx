// ─────────────────────────────────────────────
//  BotFace — SVG icon avatar per agent type
// ─────────────────────────────────────────────

import React from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

type AgentType = "extractor" | "recommender" | "planner" | "budget_watcher";

type Props = {
  agentType: AgentType;
  /** Primary accent colour */
  accent: string;
  /** Dimmed colour for inactive state */
  dim: string;
  /** Background fill of the icon container */
  headBg: string;
  /** Border colour of the container */
  headBorder: string;
  /** Whether the agent is active (configured) */
  active: boolean;
  size?: number;
};

// ─── Extractor — scan / document scanner ──────
function ExtractorIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <ClipPath id="clip_extractor">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip_extractor)">
        <Path
          d="M20 12H4"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 3.99976H18C19.1046 3.99976 20 4.89519 20 5.99976V7.99976"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8 19.9998L6 19.9998C4.89543 19.9998 4 19.1043 4 17.9998L4 15.9998"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20 15.9998V17.9998C20 19.1043 19.1046 19.9998 18 19.9998H16"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4 7.99976L4 5.99976C4 4.89519 4.89543 3.99976 6 3.99976L8 3.99976"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

// ─── Recommender — magnifying glass ───────────
function RecommenderIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        fill={color}
        d="M62.242,53.757L51.578,43.093C54.373,38.736,56,33.56,56,28C56,12.536,43.464,0,28,0
        S0,12.536,0,28s12.536,28,28,28c5.56,0,10.736-1.627,15.093-4.422l10.664,10.664
        c2.344,2.344,6.142,2.344,8.485,0S64.586,56.101,62.242,53.757z
        M28,54C13.641,54,2,42.359,2,28S13.641,2,28,2s26,11.641,26,26S42.359,54,28,54z
        M60.828,60.828c-1.562,1.562-4.095,1.562-5.656,0L44.769,50.425
        c2.145-1.606,4.051-3.513,5.657-5.656l10.402,10.402C62.391,56.732,62.391,59.266,60.828,60.828z"
      />
      <Path
        fill={color}
        d="M28,4C14.745,4,4,14.745,4,28s10.745,24,24,24s24-10.745,24-24S41.255,4,28,4z
        M28,50C15.85,50,6,40.15,6,28S15.85,6,28,6s22,9.85,22,22S40.15,50,28,50z"
      />
      <Path
        fill={color}
        d="M28,11c-0.553,0-1,0.447-1,1s0.447,1,1,1c8.284,0,15,6.716,15,15
        c0,0.553,0.447,1,1,1s1-0.447,1-1C45,18.611,37.389,11,28,11z"
      />
    </Svg>
  );
}

// ─── Planner — calendar with check ────────────
function PlannerIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1C6.44772 1 6 1.44772 6 2V3H5C3.34315 3 2 4.34315 2 6V20C2 21.6569 3.34315 23 5 23H13.101
        C12.5151 22.4259 12.0297 21.7496 11.6736 21H5C4.44772 21 4 20.5523 4 20V11H20V11.2899
        C20.7224 11.5049 21.396 11.8334 22 12.2547V6C22 4.34315 20.6569 3 19 3H18V2
        C18 1.44772 17.5523 1 17 1C16.4477 1 16 1.44772 16 2V3H8V2C8 1.44772 7.55228 1 7 1Z
        M16 6V5H8V6C8 6.55228 7.55228 7 7 7C6.44772 7 6 6.55228 6 6V5H5C4.44772 5 4 5.44772 4 6V9
        H20V6C20 5.44772 19.5523 5 19 5H18V6C18 6.55228 17.5523 7 17 7C16.4477 7 16 6.55228 16 6Z"
        fill={color}
      />
      <Path
        d="M15.2929 17.7071C15.6834 17.3166 16.3166 17.3166 16.7071 17.7071L17.3483 18.3482
        L19.2473 16.4491C19.6379 16.0586 20.271 16.0586 20.6616 16.4491C21.0521 16.8397 21.0521 17.4728
        20.6616 17.8634L18.1213 20.4036C18.0349 20.49 17.9367 20.5573 17.8318 20.6054
        C17.4488 20.8294 16.9488 20.7772 16.6203 20.4487L15.2929 19.1213
        C14.9024 18.7308 14.9024 18.0976 15.2929 17.7071Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12
        C21.3137 12 24 14.6863 24 18Z
        M13.9819 18C13.9819 20.2191 15.7809 22.0181 18 22.0181C20.2191 22.0181 22.0181 20.2191 22.0181 18
        C22.0181 15.7809 20.2191 13.9819 18 13.9819C15.7809 13.9819 13.9819 15.7809 13.9819 18Z"
        fill={color}
      />
    </Svg>
  );
}

// ─── Budget Watcher — document + calculator ───
function BudgetIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      {/* Main structural outline: document + overlaid calculator */}
      <Path
        fill={color}
        d="M427.024,222.329h-34.739v-128.8c0-2.126-0.844-4.165-2.348-5.668L304.424,2.348
        C302.921,0.844,300.882,0,298.756,0H76.425C62.574,0,51.306,11.268,51.306,25.119v410.455
        c0,13.851,11.268,25.119,25.119,25.119h128.802v17.637c0,18.566,15.105,33.67,33.67,33.67h188.126
        c18.566,0,33.67-15.105,33.67-33.67V255.999C460.694,237.433,445.589,222.329,427.024,222.329z
        M306.773,27.37l58.142,58.142h-40.505c-9.725,0-17.637-7.912-17.637-17.637V27.37z
        M76.425,444.659c-5.01,0-9.086-4.076-9.086-9.086V25.119c0-5.01,4.076-9.086,9.086-9.086h214.314v51.842
        c0,18.566,15.105,33.67,33.67,33.67h51.842v120.783H238.898c-18.566,0-33.67,15.105-33.67,33.67v188.661H76.425z
        M444.661,478.33c0,9.725-7.912,17.637-17.637,17.637H238.898c-9.725,0-17.637-7.912-17.637-17.637V255.999
        c0-9.725,7.912-17.637,17.637-17.637h188.126c9.725,0,17.637,7.912,17.637,17.637V478.33z"
      />
      {/* Calculator header row */}
      <Path
        fill={color}
        d="M409.921,256.533H256c-9.136,0-16.568,7.432-16.568,16.568v34.205c0,9.136,7.432,16.568,16.568,16.568
        h153.921c9.136,0,16.568-7.432,16.568-16.568v-34.205C426.489,263.965,419.057,256.533,409.921,256.533z
        M410.456,307.306c0,0.295-0.239,0.534-0.534,0.534H256c-0.295,0-0.534-0.239-0.534-0.534v-34.205
        c0-0.295,0.239-0.534,0.534-0.534h153.921c0.295,0,0.534,0.239,0.534,0.534V307.306z"
      />
      {/* Grid cells row 1 */}
      <Path
        fill={color}
        d="M273.102,350.596H256c-9.136,0-16.568,7.432-16.568,16.568v17.102c0,9.136,7.432,16.568,16.568,16.568
        h17.102c9.136,0,16.568-7.432,16.568-16.568v-17.102C289.67,358.028,282.238,350.596,273.102,350.596z
        M273.637,384.267c0,0.295-0.239,0.534-0.534,0.534H256c-0.295,0-0.534-0.239-0.534-0.534v-17.102
        c0-0.295,0.239-0.534,0.534-0.534h17.102c0.295,0,0.534,0.239,0.534,0.534V384.267z"
      />
      <Path
        fill={color}
        d="M341.512,350.596h-17.102c-9.136,0-16.568,7.432-16.568,16.568v17.102c0,9.136,7.432,16.568,16.568,16.568
        h17.102c9.136,0,16.568-7.432,16.568-16.568v-17.102C358.08,358.028,350.648,350.596,341.512,350.596z
        M342.046,384.267c0,0.295-0.239,0.534-0.534,0.534h-17.102c-0.295,0-0.534-0.239-0.534-0.534v-17.102
        c0-0.295,0.239-0.534,0.534-0.534h17.102c0.295,0,0.534,0.239,0.534,0.534V384.267z"
      />
      <Path
        fill={color}
        d="M409.921,350.596h-17.102c-9.136,0-16.568,7.432-16.568,16.568v17.102c0,9.136,7.432,16.568,16.568,16.568
        h17.102c9.136,0,16.568-7.432,16.568-16.568v-17.102C426.489,358.028,419.057,350.596,409.921,350.596z
        M410.456,384.267c0,0.295-0.239,0.534-0.534,0.534h-17.102c-0.295,0-0.534-0.239-0.534-0.534v-17.102
        c0-0.295,0.239-0.534,0.534-0.534h17.102c0.295,0,0.534,0.239,0.534,0.534V384.267z"
      />
    </Svg>
  );
}

// ─── Main component ────────────────────────────
export default function BotFace({
  agentType,
  accent,
  dim,
  headBg,
  headBorder,
  active,
  size = 72,
}: Props) {
  const iconColor = active ? accent : dim;
  const iconSize = size * 0.52;

  const IconComponent =
    {
      extractor: ExtractorIcon,
      recommender: RecommenderIcon,
      planner: PlannerIcon,
      budget_watcher: BudgetIcon,
    }[agentType] ?? ExtractorIcon;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: headBg,
        borderColor: active ? accent : headBorder,
        borderWidth: active ? 2 : 1.5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: active ? accent : headBorder,
        shadowOpacity: active ? 0.2 : 0.08,
        shadowRadius: active ? 5 : 2,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <IconComponent color={iconColor} size={iconSize} />
    </View>
  );
}
