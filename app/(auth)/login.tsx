import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground } from "./components/Ambientbackground";
import { IsoCube } from "./components/Isocube";
import { StatPill } from "./components/Statpill";
import { styles } from "./login.styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const router = useRouter();
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Card entry animation
  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 750,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* ── Ambient particles + grid overlay ── */}
      <AmbientBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* ── Brand section ── */}
          <View style={styles.brandSection}>
            <View style={styles.logoRow}>
              <IsoCube size={42} />
              <Text style={styles.logoText}>Smartory</Text>
            </View>

            <Text style={styles.tagline}>
              Your inventory.{"\n"}Always in command.
            </Text>

            {/* Teaser stats — peek at what's inside */}
            <View style={styles.statsRow}>
              <StatPill label="Items tracked" value="2,481" delay={500} />
              <StatPill label="Locations" value="14" delay={700} />
              <StatPill label="Alerts" value="3 low" delay={900} />
            </View>
          </View>

          {/* ── Login card ── */}
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
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>
              Sign in to access your workspace
            </Text>

            <View style={styles.form}>
              {/* Email field */}
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

              {/* Password field */}
              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <Text style={styles.forgotLink}>Forgot?</Text>
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

              {/* Sign in button */}
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
              >
                <Animated.View
                  style={[
                    styles.button,
                    { transform: [{ scale: buttonScale }] },
                  ]}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </Animated.View>
              </Pressable>
            </View>

            <Text style={styles.signupHint}>
              New to Smartory?{" "}
              <Text style={styles.signupLink}>Request access</Text>
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
