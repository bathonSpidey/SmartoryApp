import { StyleSheet } from "react-native";

const T = {
  bg: "#061a18",
  bgCard: "#0c2825",
  teal: "#14b8a6",
  tealDim: "#0d9488",
  tealGlow: "#14b8a620",
  tealBorder: "#14b8a630",
  tealBorderFocus: "#14b8a6",
  text: "#e2f4f2",
  textMuted: "#7ab8b2",
  textDim: "#4b7b78",
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
    paddingVertical: 32,
    gap: 28,
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
  },

  // ── Brand section ─────────────────────────
  brandSection: {
    gap: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    color: T.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  tagline: {
    color: T.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.tealBorder,
    backgroundColor: T.tealGlow,
    alignItems: "center",
  },
  statValue: {
    color: T.teal,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  statLabel: {
    color: T.textDim,
    fontSize: 10,
    letterSpacing: 0.3,
    marginTop: 1,
  },

  // ── Card ──────────────────────────────────
  card: {
    backgroundColor: T.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.tealBorder,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: T.teal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },

  // ── Tabs ──────────────────────────────────
  tabRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: T.textDim,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: T.text,
    fontWeight: "700",
  },
  tabUnderline: {
    height: 2,
    backgroundColor: T.tealBorder,
    borderRadius: 1,
    marginBottom: 22,
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
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
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
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  forgotLink: {
    color: T.teal,
    fontSize: 12,
    fontWeight: "600",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07201e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.tealBorder,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  inputWrapFocused: {
    borderColor: T.tealBorderFocus,
    backgroundColor: "#0a2926",
    shadowColor: T.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    color: T.textDim,
    fontSize: 13,
    width: 16,
    textAlign: "center",
  },
  input: {
    flex: 1,
    color: T.text,
    fontSize: 15,
    height: "100%",
  },

  // ── Button ────────────────────────────────
  button: {
    backgroundColor: T.teal,
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    gap: 8,
    shadowColor: T.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    color: T.bg,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  buttonArrow: {
    color: T.bg,
    fontSize: 17,
    fontWeight: "700",
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
    backgroundColor: "#14b8a620",
  },
  dividerText: {
    color: T.textDim,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // ── Grid overlay ──────────────────────────
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },

  // ── Legacy (kept for StatPill/ComingSoonModal) ──
  cardTitle: {
    color: T.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    color: T.textMuted,
    fontSize: 14,
    marginBottom: 16,
    marginTop: 2,
  },
  signupHint: {
    color: T.textDim,
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
  signupLink: {
    color: T.teal,
    fontWeight: "600",
  },
});
