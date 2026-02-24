import { StyleSheet } from "react-native";

// ── Design Tokens (inline for portability) ────
const T = {
  bg: "#061a18", // Deep teal-black
  bgCard: "#0c2825", // Slightly lighter for card
  teal: "#14b8a6", // Primary teal
  tealDim: "#0d9488",
  tealGlow: "#14b8a620",
  tealBorder: "#14b8a630",
  tealBorderFocus: "#14b8a6",
  text: "#e2f4f2", // Warm off-white
  textMuted: "#7ab8b2",
  textDim: "#4b7b78",
  amber: "#f59e0b", // Accent
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
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 32,
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
  },

  // ── Grid overlay (dot pattern via borders trick) ──
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    // The dot grid is achieved purely visually via particle components above.
    // Add a real SVG/Canvas here if needed for web.
  },

  // ── Brand section ─────────────────────────
  brandSection: {
    gap: 16,
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
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 38,
    marginTop: 4,
  },

  // ── Teaser stats ──────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  statPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.tealBorder,
    backgroundColor: T.tealGlow,
    alignItems: "center",
  },
  statValue: {
    color: T.teal,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  statLabel: {
    color: T.textDim,
    fontSize: 10,
    letterSpacing: 0.3,
    marginTop: 1,
  },

  // ── Glass card ────────────────────────────
  card: {
    backgroundColor: T.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.tealBorder,
    padding: 28,
    // iOS shadow
    shadowColor: T.teal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    // Android
    elevation: 8,
    gap: 4,
  },
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

  // ── Form ──────────────────────────────────
  form: {
    gap: 16,
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
    fontSize: 12,
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
    height: 52,
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
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    gap: 8,
    shadowColor: T.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    color: T.bg,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  buttonArrow: {
    color: T.bg,
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Sign up hint ──────────────────────────
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
