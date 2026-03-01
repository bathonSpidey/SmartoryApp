import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground } from "../../components/auth/Ambientbackground";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { IsoCube } from "../../components/auth/Isocube";
import { StatPill } from "../../components/auth/Statpill";
import {
  loginWithEmail,
  loginWithGoogle,
  signUpWithEmail,
} from "../../lib/auth.service";
import { styles } from "../../styles/login.styles";

type Tab = "signin" | "signup";

const ts = () => new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm

export default function LoginScreen() {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const renderCount = useRef(0);
  renderCount.current += 1;

  const router = useRouter();
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  console.log(
    `[Login][${ts()}] render #${renderCount.current} — tab:`,
    tab,
    "emailFocused:",
    emailFocused,
    "passFocused:",
    passFocused,
    "confirmFocused:",
    confirmFocused,
  );

  // Card entry
  useEffect(() => {
    console.log(
      `[Login][${ts()}] mounted — Platform: ${Platform.OS} ${Platform.Version}`,
    );
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 750,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) =>
      console.log(`[Login][${ts()}] cardAnim finished:`, finished),
    );
    return () => console.log(`[Login][${ts()}] unmounted`);
  }, []);

  // Keyboard event diagnostics
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) =>
      console.log(
        `[Login][${ts()}] ⌨️  keyboardDidShow height:`,
        e.endCoordinates.height,
      ),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      console.log(`[Login][${ts()}] ⌨️  keyboardDidHide`),
    );
    const willShowSub = Keyboard.addListener("keyboardWillShow", () =>
      console.log(`[Login][${ts()}] ⌨️  keyboardWillShow`),
    );
    const willHideSub = Keyboard.addListener("keyboardWillHide", () =>
      console.log(`[Login][${ts()}] ⌨️  keyboardWillHide`),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
      willShowSub.remove();
      willHideSub.remove();
    };
  }, []);

  // Track focus state changes
  useEffect(() => {
    console.log(
      `[Login][${ts()}] focus state changed — email:${emailFocused} pass:${passFocused} confirm:${confirmFocused}`,
    );
  }, [emailFocused, passFocused, confirmFocused]);

  // Tab slide indicator
  const switchTab = (next: Tab) => {
    console.log(`[Login][${ts()}] switchTab:`, tab, "→", next);
    setTab(next);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePressIn = () =>
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();

  const handlePressOut = () =>
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  // ── Sign In ──────────────────────────────────
  const handleSignIn = async () => {
    console.log(
      "[Login] handleSignIn — email:",
      email,
      "hasPassword:",
      !!password,
    );
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      console.log(`[Login][${ts()}] calling loginWithEmail...`);
      await loginWithEmail(email, password);
      console.log(
        `[Login][${ts()}] loginWithEmail success — navigating to /(tabs)`,
      );
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log(`[Login][${ts()}] loginWithEmail error:`, err.message);
      Alert.alert("Sign in failed", err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────
  const handleSignUp = async () => {
    console.log(
      "[Login] handleSignUp — email:",
      email,
      "hasPassword:",
      !!password,
      "hasConfirm:",
      !!confirmPassword,
    );
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      console.log(`[Login][${ts()}] passwords do not match`);
      Alert.alert(
        "Passwords don't match",
        "Please make sure both passwords are the same.",
      );
      return;
    }
    if (password.length < 6) {
      console.log(`[Login][${ts()}] password too short:`, password.length);
      Alert.alert(
        "Password too short",
        "Password must be at least 6 characters.",
      );
      return;
    }
    try {
      setLoading(true);
      console.log("[Login] calling signUpWithEmail...");
      const result = await signUpWithEmail(email, password);
      console.log(
        "[Login] signUpWithEmail result — hasSession:",
        !!result.session,
      );
      if (result.session) {
        console.log("[Login] session active — navigating to /(tabs)");
        router.replace("/(tabs)");
      } else {
        console.log("[Login] email confirmation required");
        Alert.alert(
          "Check your email",
          "We've sent you a confirmation link. Click it to activate your account.",
          [{ text: "Got it", onPress: () => switchTab("signin") }],
        );
      }
    } catch (err: any) {
      console.log(`[Login][${ts()}] signUpWithEmail error:`, err.message);
      Alert.alert("Sign up failed", err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google ───────────────────────────────────
  const handleGoogleLogin = async () => {
    console.log(`[Login][${ts()}] handleGoogleLogin — start`);
    try {
      setGoogleLoading(true);
      const session = await loginWithGoogle();
      console.log(
        `[Login][${ts()}] loginWithGoogle result — hasSession:`,
        !!session,
      );
      if (session) {
        console.log(
          `[Login][${ts()}] google session active — navigating to /(tabs)`,
        );
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.log(`[Login][${ts()}] loginWithGoogle error:`, err.message);
      Alert.alert(
        "Google sign in failed",
        err.message ?? "Something went wrong.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const isSignIn = tab === "signin";

  return (
    <View style={styles.container}>
      <AmbientBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.scrollContent}>
            {/* ── Brand ── */}
            <View style={styles.brandSection}>
              <View style={styles.logoRow}>
                <IsoCube size={42} />
                <Text style={styles.logoText}>Smartory</Text>
              </View>
              <Text style={styles.tagline}>Inventory,{"\n"}simplified.</Text>
              <View style={styles.statsRow}>
                <StatPill
                  label="Real-time updates"
                  value="Live Stock"
                  delay={500}
                />
                <StatPill
                  label="Low inventory"
                  value="Smart Alerts"
                  delay={700}
                />
                <StatPill
                  label="Multi-location"
                  value="All in one"
                  delay={900}
                />
              </View>
            </View>

            {/* ── Card ── */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardAnim,
                  transform: [
                    {
                      translateY: cardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Tab switcher */}
              <View style={styles.tabRow}>
                <Pressable
                  style={[styles.tabItem, isSignIn && styles.tabItemActive]}
                  onPress={() => switchTab("signin")}
                >
                  <Text
                    style={[styles.tabLabel, isSignIn && styles.tabLabelActive]}
                  >
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tabItem, !isSignIn && styles.tabItemActive]}
                  onPress={() => switchTab("signup")}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      !isSignIn && styles.tabLabelActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              <View style={styles.form}>
                {/* Email */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      emailFocused && styles.inputWrapFocused,
                    ]}
                  >
                    <Text style={styles.inputIcon}>@</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="you@company.com"
                      placeholderTextColor="#4b7b78"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="off"
                      importantForAutofill="no"
                      onFocus={() => {
                        console.log(`[Login][${ts()}] email → FOCUSED`);
                        setEmailFocused(true);
                      }}
                      onBlur={() => {
                        console.log(`[Login][${ts()}] email → BLURRED`);
                        setEmailFocused(false);
                      }}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldLabelRow}>
                    <Text style={styles.fieldLabel}>Password</Text>
                    {isSignIn && <Text style={styles.forgotLink}>Forgot?</Text>}
                  </View>
                  <View
                    style={[
                      styles.inputWrap,
                      passFocused && styles.inputWrapFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color="#3d706a"
                      style={{ width: 16, textAlign: "center" }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••••"
                      placeholderTextColor="#4b7b78"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete="off"
                      importantForAutofill="no"
                      onFocus={() => {
                        console.log(`[Login][${ts()}] password → FOCUSED`);
                        setPassFocused(true);
                      }}
                      onBlur={() => {
                        console.log(`[Login][${ts()}] password → BLURRED`);
                        setPassFocused(false);
                      }}
                    />
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      style={styles.eyeButton}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={18}
                        color="#3d706a"
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password — Sign Up only */}
                {!isSignIn && (
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Confirm Password</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        confirmFocused && styles.inputWrapFocused,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={15}
                        color="#3d706a"
                        style={{ width: 16, textAlign: "center" }}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••••"
                        placeholderTextColor="#4b7b78"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoComplete="off"
                        importantForAutofill="no"
                        onFocus={() => {
                          console.log(
                            `[Login][${ts()}] confirmPassword → FOCUSED`,
                          );
                          setConfirmFocused(true);
                        }}
                        onBlur={() => {
                          console.log(
                            `[Login][${ts()}] confirmPassword → BLURRED`,
                          );
                          setConfirmFocused(false);
                        }}
                      />
                      <Pressable
                        onPress={() => setShowConfirmPassword((v) => !v)}
                        style={styles.eyeButton}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={
                            showConfirmPassword
                              ? "eye-outline"
                              : "eye-off-outline"
                          }
                          size={18}
                          color="#3d706a"
                        />
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Primary button */}
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={isSignIn ? handleSignIn : handleSignUp}
                  disabled={loading}
                >
                  <Animated.View
                    style={[
                      styles.button,
                      {
                        transform: [{ scale: buttonScale }],
                        opacity: loading ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.buttonText}>
                      {loading
                        ? isSignIn
                          ? "Signing in…"
                          : "Creating account…"
                        : isSignIn
                          ? "Sign In"
                          : "Create Account"}
                    </Text>
                    {!loading && <Text style={styles.buttonArrow}>→</Text>}
                  </Animated.View>
                </Pressable>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google */}
                <GoogleSignInButton
                  onPress={handleGoogleLogin}
                  loading={googleLoading}
                />
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
