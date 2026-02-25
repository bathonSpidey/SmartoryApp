/**
 * Legacy Colors.ts — bridges Themed.tsx (which reads from this file)
 * to the new Smartory design system in Themes.ts.
 *
 * For new screens and components, use `useTheme()` from hooks/useTheme.ts.
 */
import { ThemeDark, ThemeLight } from "./Themes";

export default {
  light: {
    text: ThemeLight.text,
    background: ThemeLight.background,
    tint: ThemeLight.primary,
    tabIconDefault: ThemeLight.textDim,
    tabIconSelected: ThemeLight.primary,
  },
  dark: {
    text: ThemeDark.text,
    background: ThemeDark.background,
    tint: ThemeDark.primary,
    tabIconDefault: ThemeDark.textDim,
    tabIconSelected: ThemeDark.primary,
  },
};
