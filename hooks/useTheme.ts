/**
 * useTheme()
 *
 * Returns the active SemanticTheme (ThemeLight or ThemeDark) honoring
 * the user's manual preference from ThemeContext, with the system
 * appearance as the fallback.
 *
 * Usage:
 *   const theme = useTheme();
 *   <View style={{ backgroundColor: theme.background }} />
 */

import type { SemanticTheme } from "@/constants/Themes";
import { useThemeContext } from "@/contexts/ThemeContext";

export function useTheme(): SemanticTheme {
  return useThemeContext().theme;
}
