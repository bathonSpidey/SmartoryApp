import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

// ── Email / Password sign in ──────────────────

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
}

// ── Email / Password sign up ──────────────────

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  // data.session is null when email confirmation is required.
  // data.user will exist either way.
  return data;
}

// ── Google OAuth ──────────────────────────────

export async function loginWithGoogle() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "smartory",
    path: "auth/callback",
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL returned from Supabase");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

  if (result.type !== "success") return null;

  const { data: sessionData } = await supabase.auth.getSession();
  return sessionData.session;
}
