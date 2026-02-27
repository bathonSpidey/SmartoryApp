// ─────────────────────────────────────────────
//  Smartory — Design System v2
//  Aesthetic: Warm-Professional / Smart Home
//  Serves both B2B operators and everyday users
//  (think: kitchen pantry meets smart assistant)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
//  Semantic Theme Type
//  Both ThemeLight and ThemeDark satisfy this.
//  Use the `useTheme()` hook — never import
//  ThemeLight / ThemeDark directly in screens.
// ─────────────────────────────────────────────

export type SemanticTheme = {
  // ── Surfaces ─────────────────────────────
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceInput: string;
  surfaceHover: string;
  surfaceSubtle: string;

  // ── Borders ──────────────────────────────
  border: string;
  borderFocus: string;
  borderStrong: string;

  // ── Brand / Primary ───────────────────────
  primary: string;
  primaryDim: string;
  primaryDeep: string;
  primaryGlow: string;
  primaryText: string;

  // ── Text ─────────────────────────────────
  text: string;
  textMuted: string;
  textDim: string;
  textInverse: string;

  // ── Semantic ─────────────────────────────
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;

  // ── Shadows ──────────────────────────────
  shadowCard: {
    boxShadow: string;
    elevation: number;
  };
  shadowPrimary: {
    boxShadow: string;
    elevation: number;
  };
};

// ─────────────────────────────────────────────
//  Light Theme  — "Night Owl Light"
//  Soft off-whites + cool blue-grey neutrals.
//  Based on Sarah Drasner's Night Owl Light.
// ─────────────────────────────────────────────

export const ThemeLight: SemanticTheme = {
  // ── Surfaces ─────────────────────────────
  background: "#fbfbfb", // editor.background
  surface: "#f6f6f6", // tab.activeBackground
  surfaceElevated: "#f0f0f0", // activityBar / sideBar
  surfaceInput: "#f0f0f0", // input.background
  surfaceHover: "#d3e8f8", // list.hoverBackground
  surfaceSubtle: "#f0f0f0",

  // ── Borders ──────────────────────────────
  border: "#d9d9d9", // widget.shadow / dropdown.border
  borderFocus: "#2aa298", // inputOption.activeBorder
  borderStrong: "#cccccc", // scrollbar.shadow

  // ── Brand ────────────────────────────────
  primary: "#2aa298", // button.background / badge
  primaryDim: "#08916a", // terminal.ansiGreen (darker teal)
  primaryDeep: "#d3e8f8", // list.activeSelectionBackground
  primaryGlow: "#2aa29814",
  primaryText: "#2aa298",

  // ── Text ─────────────────────────────────
  text: "#403f53", // foreground
  textMuted: "#93a1a1", // input.placeholderForeground
  textDim: "#90a7b2", // editorCursor / editorLineNumber
  textInverse: "#f0f0f0",

  // ── Semantic ─────────────────────────────
  success: "#08916a",
  successBg: "#08916a14",
  warning: "#daaa01",
  warningBg: "#daaa0114",
  error: "#de3d3b",
  errorBg: "#de3d3b14",
  info: "#288ed7",
  infoBg: "#288ed714",

  // ── Shadows ──────────────────────────────
  shadowCard: {
    boxShadow: "0px 3px 16px rgba(64,63,83,0.08)",
    elevation: 4,
  },
  shadowPrimary: {
    boxShadow: "0px 4px 16px rgba(42,162,152,0.22)",
    elevation: 5,
  },
};

// ─────────────────────────────────────────────
//  Dark Theme  — "Night Owl"
//  Deep navy-blue + cyan — Sarah Drasner's
//  iconic Night Owl VS Code theme.
// ─────────────────────────────────────────────

export const ThemeDark: SemanticTheme = {
  // ── Surfaces ─────────────────────────────
  background: "#011627", // editor.background
  surface: "#0b2942", // tab.activeBackground
  surfaceElevated: "#0e293f", // list.inactiveSelectionBackground
  surfaceInput: "#0b253a", // input.background
  surfaceHover: "#1d3b53", // editor.selectionBackground
  surfaceSubtle: "#010d18", // list.focusBackground

  // ── Borders ──────────────────────────────
  border: "#122d42", // contrastBorder / focusBorder
  borderFocus: "#7fdbca", // terminal.ansiBrightCyan
  borderStrong: "#1d3b53", // editor.selectionBackground

  // ── Brand ────────────────────────────────
  primary: "#7fdbca", // terminal.ansiBrightCyan
  primaryDim: "#21c7a8", // terminal.ansiCyan
  primaryDeep: "#0b2942", // tab.activeBackground
  primaryGlow: "#7fdbca18",
  primaryText: "#7fdbca",

  // ── Text ─────────────────────────────────
  text: "#d6deeb", // editor.foreground
  textMuted: "#5f7e97", // sideBarTitle / status bar
  textDim: "#4b6479", // editorLineNumber.foreground
  textInverse: "#011627",

  // ── Semantic ─────────────────────────────
  success: "#22da6e", // terminal.ansiGreen
  successBg: "#22da6e18",
  warning: "#ffca28", // inputValidation.warningBorder
  warningBg: "#ffca2818",
  error: "#ef5350", // errorForeground
  errorBg: "#ef535018",
  info: "#82aaff", // terminal.ansiBlue
  infoBg: "#82aaff18",

  // ── Shadows ──────────────────────────────
  shadowCard: {
    boxShadow: "0px 8px 32px rgba(1,22,39,0.6)",
    elevation: 8,
  },
  shadowPrimary: {
    boxShadow: "0px 4px 20px rgba(127,219,202,0.25)",
    elevation: 6,
  },
};

// ─────────────────────────────────────────────
//  Global Brand Palette  (theme-independent)
// ─────────────────────────────────────────────

export const Colors = {
  // ── Brand ────────────────────────────────────
  primary: "#0d9488",
  primaryLight: "#14b8a6",
  primaryMuted: "#ccfbf1",
  primaryDark: "#0f766e",

  // ── Accent  (amber = warmth, receipts) ──────
  accent: "#f59e0b",
  accentLight: "#fef3c7",
  accentDark: "#d97706",
  accentDeep: "#92400e",

  // ── Warm Neutrals (stone, not cold slate) ───
  ink: "#1c1410",
  stone900: "#1c1410",
  stone700: "#44403c",
  stone500: "#78716c",
  stone300: "#d6d3d1",
  stone100: "#f5f5f4",
  stone50: "#faf9f7",

  // ── Legacy aliases (keep backward compat) ───
  slate900: "#134e4a",
  slate700: "#374151",
  slate500: "#6b7280",
  slate300: "#d1d5db",
  slate100: "#f3f4f6",
  slate50: "#f9fafb",

  // ── Semantic ─────────────────────────────────
  success: "#059669",
  successLight: "#ecfdf5",
  warning: "#d97706",
  warningLight: "#fffbeb",
  error: "#dc2626",
  errorLight: "#fef2f2",
  info: "#2563eb",
  infoLight: "#eff6ff",

  // ── Base ─────────────────────────────────────
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  // ── Aliases ──────────────────────────────────
  background: "#faf8f5",
  surface: "#ffffff",
  surfaceElevated: "#f5f2ec",
  text: "#1c1410",
  textMuted: "#7c7168",
  textInverse: "#ffffff",
  border: "#e5dfd5",
  borderStrong: "#cec8be",
  secondary: "#78716c",
};

// ─────────────────────────────────────────────
//  Typography
//  DM Sans = approachable & human (great for
//  everyday users). Space Grotesk = pro edge.
// ─────────────────────────────────────────────

export const Typography = {
  fontFamily: {
    display: "SpaceGrotesk_600SemiBold",
    displayBold: "SpaceGrotesk_700Bold",
    body: "DMSans_400Regular",
    bodyMedium: "DMSans_500Medium",
    bodyBold: "DMSans_700Bold",
    mono: "SpaceMono_400Regular", // for SKUs / barcodes
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 36,
    "4xl": 44,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2, // used for ALL-CAPS labels / category tags
  },
};

// ─────────────────────────────────────────────
//  Spacing (8pt grid)
// ─────────────────────────────────────────────

export const Spacing = {
  "0": 0,
  px: 1,
  "0.5": 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
  // Layout-specific
  screenPadding: 20,
  cardPadding: 16,
  sectionGap: 28,
};

// ─────────────────────────────────────────────
//  Border Radius
//  Slightly rounder than v1 — more approachable
//  and friendly for non-B2B users.
// ─────────────────────────────────────────────

export const Radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  "2xl": 32,
  full: 9999,
};

// ─────────────────────────────────────────────
//  Shadows
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
//  Shadows  (warm brown base — not cold gray)
//  Use theme.shadowCard / theme.shadowPrimary
//  for theme-aware shadows in screens.
// ─────────────────────────────────────────────

export const Shadow = {
  none: {},
  soft: {
    boxShadow: "0px 2px 10px rgba(124, 111, 90, 0.06)",
    elevation: 2,
  },
  xs: {
    boxShadow: "0px 1px 4px rgba(124, 111, 90, 0.04)",
    elevation: 1,
  },
  sm: {
    boxShadow: "0px 2px 8px rgba(124, 111, 90, 0.06)",
    elevation: 2,
  },
  md: {
    boxShadow: "0px 4px 16px rgba(124, 111, 90, 0.08)",
    elevation: 4,
  },
  lg: {
    boxShadow: "0px 8px 24px rgba(124, 111, 90, 0.1)",
    elevation: 8,
  },
  primary: {
    boxShadow: "0px 4px 16px rgba(13, 148, 136, 0.22)",
    elevation: 5,
  },
};

// ─────────────────────────────────────────────
//  Z-Index
// ─────────────────────────────────────────────

export const ZIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
};

// ─────────────────────────────────────────────
//  Animation / Timing
// ─────────────────────────────────────────────

export const Animation = {
  duration: {
    instant: 80,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },
  // For use with react-native-reanimated Easing
  easing: {
    standard: "easeInOut",
    enter: "easeOut",
    exit: "easeIn",
    spring: { damping: 18, stiffness: 160, mass: 1 },
  },
};

// ─────────────────────────────────────────────
//  Component Tokens  (pre-composed styles)
// ─────────────────────────────────────────────

export const ComponentTokens = {
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.cardPadding,
    ...Shadow.md,
  },
  badge: {
    inStock: {
      backgroundColor: Colors.successLight,
      color: Colors.success,
    },
    lowStock: {
      backgroundColor: Colors.warningLight,
      color: Colors.warning,
    },
    outOfStock: {
      backgroundColor: Colors.errorLight,
      color: Colors.error,
    },
    category: {
      backgroundColor: Colors.primaryMuted,
      color: Colors.primaryDark,
    },
  },
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.size.base,
  },
  button: {
    primary: {
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: Colors.primary,
      paddingHorizontal: Spacing.xl,
    },
    secondary: {
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: Colors.transparent,
      borderWidth: 1.5,
      borderColor: Colors.primary,
      paddingHorizontal: Spacing.xl,
    },
    ghost: {
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: Colors.transparent,
      paddingHorizontal: Spacing.xl,
    },
    destructive: {
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: Colors.error,
      paddingHorizontal: Spacing.xl,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: Radius.md,
      backgroundColor: Colors.stone100,
    },
  },
  navbar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 64,
  },
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
};

// ─────────────────────────────────────────────
//  Inventory-specific Status Palette
// ─────────────────────────────────────────────

export const StockStatus = {
  inStock: {
    label: "In Stock",
    color: Colors.success,
    background: Colors.successLight,
  },
  lowStock: {
    label: "Low Stock",
    color: Colors.warning,
    background: Colors.warningLight,
  },
  outOfStock: {
    label: "Out of Stock",
    color: Colors.error,
    background: Colors.errorLight,
  },
  onOrder: {
    label: "On Order",
    color: Colors.info,
    background: Colors.infoLight,
  },
  discontinued: {
    label: "Discontinued",
    color: Colors.stone500,
    background: Colors.stone100,
  },
};
