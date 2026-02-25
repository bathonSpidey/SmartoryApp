/**
 * ThemeContext
 *
 * Provides a user-controlled theme preference that overrides the system
 * setting.  Preference is persisted to AsyncStorage so it survives restarts.
 *
 *  "system"  →  follow iOS/Android system appearance  (default)
 *  "light"   →  always light
 *  "dark"    →  always dark
 */

import { ThemeDark, ThemeLight, type SemanticTheme } from "@/constants/Themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "@smartory/themeMode";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  /** The active resolved theme object — use this for colors. */
  theme: SemanticTheme;
  /** The user's preference: "system" | "light" | "dark" */
  mode: ThemeMode;
  /** Whether the resolved theme is dark. */
  isDark: boolean;
  /** Update the user's theme preference. */
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: ThemeLight,
  mode: "system",
  isDark: false,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [mode, setModeState] = useState<ThemeMode>("system");

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  // Resolve: user preference wins; "system" defers to OS
  const resolvedScheme = mode === "system" ? (systemScheme ?? "light") : mode;
  const isDark = resolvedScheme === "dark";
  const theme = isDark ? ThemeDark : ThemeLight;

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}
