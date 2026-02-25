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
//  Light Theme  — "Warm Pantry"
//  Cream whites + warm stone neutrals.
//  Feels like a tidy kitchen notepad, not a
//  cold enterprise dashboard.
// ─────────────────────────────────────────────

export const ThemeLight: SemanticTheme = {
  // ── Surfaces ─────────────────────────────
  background: "#faf8f5", // warm cream — linen / paper
  surface: "#ffffff",
  surfaceElevated: "#f5f2ec",
  surfaceInput: "#f2efe9",
  surfaceHover: "#ede9e2",
  surfaceSubtle: "#f7f4ef",

  // ── Borders ──────────────────────────────
  border: "#e5dfd5", // warm beige divider
  borderFocus: "#0d9488",
  borderStrong: "#cec8be",

  // ── Brand ────────────────────────────────
  primary: "#0d9488",
  primaryDim: "#0f766e",
  primaryDeep: "#e6faf8", // light teal tint for avatar bg, chips
  primaryGlow: "#0d948814",
  primaryText: "#0d9488",

  // ── Text ─────────────────────────────────
  text: "#1c1410", // warm near-black (stone, not cold slate)
  textMuted: "#7c7168", // warm mid-brown
  textDim: "#a89f97", // warm light — placeholder, disabled
  textInverse: "#ffffff",

  // ── Semantic ─────────────────────────────
  success: "#059669",
  successBg: "#ecfdf5",
  warning: "#d97706",
  warningBg: "#fffbeb",
  error: "#dc2626",
  errorBg: "#fef2f2",
  info: "#2563eb",
  infoBg: "#eff6ff",

  // ── Shadows ──────────────────────────────
  shadowCard: {
    boxShadow: "0px 3px 16px rgba(124,111,90,0.08)",
    elevation: 4,
  },
  shadowPrimary: {
    boxShadow: "0px 4px 16px rgba(13,148,136,0.2)",
    elevation: 5,
  },
};

// ─────────────────────────────────────────────
//  Dark Theme  — "Deep Forest Kitchen"
//  Warm deep teal-greens — not cold blue-black.
//  Feels like a premium smart-home UI at night.
// ─────────────────────────────────────────────

export const ThemeDark: SemanticTheme = {
  // ── Surfaces ─────────────────────────────
  background: "#0c1a16",
  surface: "#112620",
  surfaceElevated: "#162e27",
  surfaceInput: "#0e221d",
  surfaceHover: "#1a3229",
  surfaceSubtle: "#0e1f1b",

  // ── Borders ──────────────────────────────
  border: "#1e3f38",
  borderFocus: "#14b8a6",
  borderStrong: "#2a5248",

  // ── Brand ────────────────────────────────
  primary: "#14b8a6",
  primaryDim: "#0d9488",
  primaryDeep: "#073d37",
  primaryGlow: "#14b8a614",
  primaryText: "#14b8a6",

  // ── Text ─────────────────────────────────
  text: "#e8f5f2",
  textMuted: "#6fa89e",
  textDim: "#3d7269",
  textInverse: "#0c1a16",

  // ── Semantic ─────────────────────────────
  success: "#10b981",
  successBg: "#10b98118",
  warning: "#f59e0b",
  warningBg: "#f59e0b18",
  error: "#ef4444",
  errorBg: "#ef444418",
  info: "#3b82f6",
  infoBg: "#3b82f618",

  // ── Shadows ──────────────────────────────
  shadowCard: {
    boxShadow: "0px 8px 32px rgba(20,184,166,0.12)",
    elevation: 8,
  },
  shadowPrimary: {
    boxShadow: "0px 4px 20px rgba(20,184,166,0.3)",
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
    shadowColor: "#7c6f5a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  xs: {
    shadowColor: "#7c6f5a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: "#7c6f5a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: "#7c6f5a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: "#7c6f5a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
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
