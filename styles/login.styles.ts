import { Platform, StyleSheet } from "react-native";

// ── Design tokens (dark palette) ──────────────────────────────
export const T = {
  bg: "#050f0e", // page background
  bgCard: "#0b211f", // card surface
  bgInput: "#06171500", // transparent, inherits card
  bgInputFill: "#071c1a", // solid input bg
  teal: "#14b8a6",
  tealDim: "#0d9488",
  tealDeep: "#065f59",
  tealGlow: "#14b8a614",
  tealBorder: "#14b8a625",
  tealBorderFocus: "#14b8a6",
  text: "#dff0ed",
  textMuted: "#6ea8a2",
  textDim: "#3d706a",
  amber: "#f59e0b",
  white: "#ffffff",
};

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 32,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },

  // ── Brand section ─────────────────────────
  brandSection: {
    gap: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    color: T.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  tagline: {
    color: T.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1.2,
    lineHeight: 36,
  },
  taglineAccent: {
    color: T.teal,
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 2,
  },
  statPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: T.tealBorder,
    backgroundColor: T.tealGlow,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statValue: {
    color: T.teal,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  statLabel: {
    color: T.textDim,
    fontSize: 12,
    letterSpacing: 0,
  },

  // ── Card ──────────────────────────────────
  card: {
    backgroundColor: T.bgCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.tealBorder,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
    boxShadow: "0px 12px 40px rgba(20,184,166,0.1)",
    elevation: 8,
  },

  // ── Tabs ──────────────────────────────────
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#06100f",
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 7,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  tabItemActive: {
    backgroundColor: T.tealDeep,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: T.textDim,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: T.text,
    fontWeight: "700",
  },
  // Kept for Animated.View ref compatibility — visually hidden
  tabUnderline: {
    height: 0,
    marginBottom: 0,
    overflow: "hidden",
  },
  tabUnderlineActive: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: T.teal,
    borderRadius: 1,
  },

  // ── Form ──────────────────────────────────
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 7,
  },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldLabel: {
    color: T.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  forgotLink: {
    color: T.teal,
    fontSize: 12,
    fontWeight: "600",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071c1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.tealBorder,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  inputWrapFocused: {
    borderColor: T.tealBorderFocus,
    backgroundColor: "#09211f",
    boxShadow: "0px 0px 10px rgba(20,184,166,0.18)",
    elevation: 3,
  },
  inputIcon: {
    color: T.textDim,
    fontSize: 12,
    width: 16,
    textAlign: "center",
  },
  input: {
    flex: 1,
    color: T.text,
    fontSize: 15,
    height: "100%",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  eyeButton: {
    padding: 4,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },

  // ── Button ────────────────────────────────
  button: {
    backgroundColor: T.teal,
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    gap: 8,
    boxShadow: "0px 4px 20px rgba(20,184,166,0.35)",
    elevation: 6,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  buttonText: {
    color: T.bg,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  buttonArrow: {
    color: T.bg,
    fontSize: 16,
    fontWeight: "600",
  },

  // ── Divider ───────────────────────────────
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.tealBorder,
  },
  dividerText: {
    color: T.textDim,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ── Form footer (terms/hint) ──────────────
  formFooter: {
    textAlign: "center",
    color: T.textDim,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  formFooterLink: {
    color: T.tealDim,
    fontWeight: "600",
  },
});
