/**
 * Expo config plugin — sets android:importantForAutofill="noExcludeDescendants"
 * on every Activity in the AndroidManifest.
 *
 * This prevents Android's classic Autofill framework (API 26+) from traversing
 * the view tree and moving focus between inputs. The JS-side fix (correct
 * autoComplete values) handles Credential Manager (API 33+).
 */
const { withAndroidManifest } = require("expo/config-plugins");

const withAutofillFix = (config) => {
  return withAndroidManifest(config, (mod) => {
    const activities = mod.modResults.manifest.application?.[0]?.activity ?? [];
    activities.forEach((activity) => {
      if (!activity.$) activity.$ = {};
      activity.$["android:importantForAutofill"] = "noExcludeDescendants";
    });
    return mod;
  });
};

module.exports = withAutofillFix;
