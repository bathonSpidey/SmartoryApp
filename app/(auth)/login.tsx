import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    loginWithEmail,
    loginWithGoogle,
    signUpWithEmail,
} from "./auth.service";
import { AmbientBackground } from "./components/Ambientbackground";
import { GoogleSignInButton } from "./components/GoogleSignInButton";
import { IsoCube } from "./components/Isocube";
import { StatPill } from "./components/Statpill";
import { styles } from "./login.styles";

type Tab = "signin" | "signup";

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

  const router = useRouter();
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const tabSlide = useRef(new Animated.Value(0)).current;

  // Card entry
  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 750,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Tab slide indicator
  const switchTab = (next: Tab) => {
    setTab(next);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    Animated.spring(tabSlide, {
      toValue: next === "signin" ? 0 : 1,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
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
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await loginWithEmail(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Sign in failed", err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords don't match",
        "Please make sure both passwords are the same.",
      );
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Password must be at least 6 characters.",
      );
      return;
    }
    try {
      setLoading(true);
      const result = await signUpWithEmail(email, password);
      if (result.session) {
        // Email confirmation disabled in Supabase → go straight in
        router.replace("/(tabs)");
      } else {
        // Email confirmation required
        Alert.alert(
          "Check your email",
          "We've sent you a confirmation link. Click it to activate your account.",
          [{ text: "Got it", onPress: () => switchTab("signin") }],
        );
      }
    } catch (err: any) {
      Alert.alert("Sign up failed", err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google ───────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const session = await loginWithGoogle();
      if (session) router.replace("/(tabs)");
    } catch (err: any) {
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            centerContent
          >
            {/* ── Brand ── */}
            <View style={styles.brandSection}>
              <View style={styles.logoRow}>
                <IsoCube size={42} />
                <Text style={styles.logoText}>Smartory</Text>
              </View>
              <Text style={styles.tagline}>
                Manage your Inventory.{"\n"}Uplift your life.
              </Text>
              <View style={styles.statsRow}>
                <StatPill
                  label="to get Insights"
                  value="Customized Agents"
                  delay={500}
                />
                <StatPill label="Agents" value="Manage" delay={700} />
                <StatPill label="on expiring items" value="Get Alerts" delay={900} />
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
                  style={styles.tabItem}
                  onPress={() => switchTab("signin")}
                >
                  <Text
                    style={[styles.tabLabel, isSignIn && styles.tabLabelActive]}
                  >
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.tabItem}
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

              {/* Static underline with active half highlight */}
              <View style={styles.tabUnderline}>
                <Animated.View
                  style={[
                    styles.tabUnderlineActive,
                    {
                      transform: [
                        {
                          translateX: tabSlide.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"] as any,
                          }),
                        },
                      ],
                    },
                  ]}
                />
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
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
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
                    <Text style={styles.inputIcon}>⬤</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••••"
                      placeholderTextColor="#4b7b78"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      onFocus={() => setPassFocused(true)}
                      onBlur={() => setPassFocused(false)}
                    />
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
                      <Text style={styles.inputIcon}>⬤</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••••"
                        placeholderTextColor="#4b7b78"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        onFocus={() => setConfirmFocused(true)}
                        onBlur={() => setConfirmFocused(false)}
                      />
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
