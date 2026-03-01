import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
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

// Memoize the Brand section to prevent re-renders during typing
const BrandSection = memo(() => (
  <View style={styles.brandSection}>
    <View style={styles.logoRow}>
      <IsoCube size={42} />
      <Text style={styles.logoText}>Smartory</Text>
    </View>
    <Text style={styles.tagline}>Inventory,{"\n"}simplified.</Text>
    <View style={styles.statsRow}>
      <StatPill label="Real-time updates" value="Live Stock" delay={500} />
      <StatPill label="Low inventory" value="Smart Alerts" delay={700} />
      <StatPill label="Multi-location" value="All in one" delay={900} />
    </View>
  </View>
));

export default function LoginScreen() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Refs for keyboard "Next" chaining
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 750,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const isSignIn = tab === "signin";

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (isSignIn) {
        await loginWithEmail(email, password);
        router.replace("/(tabs)");
      } else {
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");
        await signUpWithEmail(email, password);
        Alert.alert("Check email", "Confirmation link sent.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const session = await loginWithGoogle();
      if (session) router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

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
          >
            <BrandSection />

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
              {/* Tab Switcher */}
              <View style={styles.tabRow}>
                {(["signin", "signup"] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.tabItem, tab === t && styles.tabItemActive]}
                    onPress={() => setTab(t)}
                  >
                    <Text
                      style={[
                        styles.tabLabel,
                        tab === t && styles.tabLabelActive,
                      ]}
                    >
                      {t === "signin" ? "Sign In" : "Sign Up"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.form}>
                {/* Email Field */}
                <View style={styles.fieldGroup} pointerEvents="box-none">
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputIcon, { marginLeft: 14 }]}>
                      @
                    </Text>
                    <TextInput
                      ref={emailRef}
                      style={styles.input}
                      placeholder="you@company.com"
                      placeholderTextColor="#4b7b78"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete={isSignIn ? "username" : "email"}
                      textContentType={isSignIn ? "username" : "emailAddress"}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.fieldGroup} pointerEvents="box-none">
                  <View style={styles.fieldLabelRow}>
                    <Text style={styles.fieldLabel}>Password</Text>
                    {isSignIn ? (
                      <Text style={styles.forgotLink}>Forgot?</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color="#3d706a"
                      style={{ marginLeft: 14 }}
                    />
                    <TextInput
                      ref={passwordRef}
                      style={styles.input}
                      placeholder="••••••••••"
                      placeholderTextColor="#4b7b78"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete={
                        isSignIn ? "current-password" : "new-password"
                      }
                      textContentType={isSignIn ? "password" : "newPassword"}
                      returnKeyType={isSignIn ? "done" : "next"}
                      onSubmitEditing={() =>
                        isSignIn
                          ? handleAuth()
                          : confirmPasswordRef.current?.focus()
                      }
                      blurOnSubmit={isSignIn}
                      underlineColorAndroid="transparent"
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      hitSlop={15}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={18}
                        color="#3d706a"
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Confirm Password (Sign Up Only) */}
                {!isSignIn ? (
                  <View style={styles.fieldGroup} pointerEvents="box-none">
                    <Text style={styles.fieldLabel}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={15}
                        color="#3d706a"
                        style={{ marginLeft: 14 }}
                      />
                      <TextInput
                        ref={confirmPasswordRef}
                        style={styles.input}
                        placeholder="••••••••••"
                        placeholderTextColor="#4b7b78"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={handleAuth}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                  </View>
                ) : null}

                <Pressable onPress={handleAuth} disabled={loading}>
                  <Animated.View
                    style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
                  >
                    <Text style={styles.buttonText}>
                      {loading
                        ? "Processing..."
                        : isSignIn
                          ? "Sign In"
                          : "Create Account"}
                    </Text>
                    {!loading ? (
                      <Text style={styles.buttonArrow}>→</Text>
                    ) : null}
                  </Animated.View>
                </Pressable>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

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
