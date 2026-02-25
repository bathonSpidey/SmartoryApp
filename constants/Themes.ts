// ─────────────────────────────────────────────
//  Smartory — Design System
//  Aesthetic: Industrial-Minimal / Professional
// ─────────────────────────────────────────────

export const Colors = {
  // ── Brand ──────────────────────────────────
  primary: "#0d9488", // Teal-600: precise, efficient, trustworthy
  primaryLight: "#14b8a6", // Teal-500: hover / active states
  primaryMuted: "#ccfbf1", // Teal-100: backgrounds, tags, badges
  primaryDark: "#0f766e", // Teal-700: pressed states, deep emphasis

  // ── Accent ─────────────────────────────────
  accent: "#f59e0b", // Amber-400: low-stock warnings, highlights
  accentLight: "#fef3c7", // Amber-100: warning backgrounds
  accentDark: "#d97706", // Amber-600: warning icons / text

  // ── Neutrals ───────────────────────────────
  ink: "#0c1a1a", // Near-black, slightly warm
  slate900: "#134e4a", // Deep teal-slate (nav bar, headings)
  slate700: "#374151", // Body text
  slate500: "#6b7280", // Muted / secondary text
  slate300: "#d1d5db", // Borders, dividers
  slate100: "#f3f4f6", // Surface tint
  slate50: "#f9fafb", // Page background

  // ── Semantic ───────────────────────────────
  success: "#10b981", // Emerald-500: in-stock, confirmed
  successLight: "#d1fae5", // Emerald-100
  warning: "#f59e0b", // Amber-400: low-stock
  warningLight: "#fef3c7", // Amber-100
  error: "#ef4444", // Red-500: out-of-stock, errors
  errorLight: "#fee2e2", // Red-100
  info: "#3b82f6", // Blue-500: informational
  infoLight: "#dbeafe", // Blue-100

  // ── Base ───────────────────────────────────
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  // ── Aliases (keep existing references working) ──
  background: "#f9fafb",
  surface: "#ffffff",
  surfaceElevated: "#f3f4f6",
  text: "#0c1a1a",
  textMuted: "#6b7280",
  textInverse: "#ffffff",
  border: "#e5e7eb",
  borderStrong: "#d1d5db",
  secondary: "#6b7280",
};

// ─────────────────────────────────────────────
//  Typography
// ─────────────────────────────────────────────

export const Typography = {
  fontFamily: {
    // Pair: "DM Sans" (body) + "Space Grotesk" (display)
    // Install: expo install @expo-google-fonts/dm-sans @expo-google-fonts/space-grotesk
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
// ─────────────────────────────────────────────

export const Radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  "2xl": 28,
  full: 9999,
};

// ─────────────────────────────────────────────
//  Shadows
// ─────────────────────────────────────────────

export const Shadow = {
  // Legacy alias
  soft: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  // Expanded set
  none: {},
  xs: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  // Tinted shadow for primary cards
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
      backgroundColor: Colors.slate100,
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
    color: Colors.slate500,
    background: Colors.slate100,
  },
};

// ─────────────────────────────────────────────
//  Dark Theme  (app-wide semantic tokens)
//  Use these for dark-mode screens so each
//  screen never hard-codes hex values.
// ─────────────────────────────────────────────

export const ThemeDark = {
  // ── Surfaces ─────────────────────────────
  background: "#050f0e", // page / screen
  surface: "#0b211f", // card, sheet
  surfaceInput: "#071c1a", // input field
  surfaceHover: "#09211f", // focused input / hovered item
  surfaceSubtle: "#06100f", // pill background, tab track

  // ── Borders ──────────────────────────────
  border: "#14b8a625", // default border
  borderFocus: "#14b8a6", // focused border
  borderStrong: "#14b8a640", // dividers, strong rule

  // ── Brand ────────────────────────────────
  primary: "#14b8a6", // teal-500
  primaryDim: "#0d9488", // teal-600
  primaryDeep: "#065f59", // teal-900 (active tab bg)
  primaryGlow: "#14b8a614", // glow / pill fill

  // ── Text ─────────────────────────────────
  text: "#dff0ed", // primary body
  textMuted: "#6ea8a2", // labels, captions
  textDim: "#3d706a", // placeholder, disabled
  textInverse: "#050f0e", // on primary button

  // ── Semantic ─────────────────────────────
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // ── Shadow ───────────────────────────────
  shadowPrimary: {
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  shadowCard: {
    shadowColor: "#14b8a6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 8,
  },
};
