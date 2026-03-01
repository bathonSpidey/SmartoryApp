/**
 * Expo config plugin: disables Android Autofill / Credential Manager
 * traversal on the MainActivity.
 *
 * On Android API 26+ the autofill service scans all Activities for
 * username/password fields and moves focus between them automatically.
 * Setting android:importantForAutofill="noExcludeDescendants" on the
 * Activity stops this traversal at the window level, which cannot be
 * overridden from JavaScript (View/TextInput props are insufficient on API 36+).
 */
const { withAndroidManifest } = require("expo/config-plugins");

const withAutofillFix = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = manifest.manifest.application[0];
    const activities = app.activity ?? [];

    activities.forEach((activity) => {
      const name = activity.$?.["android:name"] ?? "";
      // Target the main launcher activity
      if (
        name === ".MainActivity" ||
        name === "com.roboinno.smartory.MainActivity" ||
        name.includes("MainActivity")
      ) {
        if (!activity.$) activity.$ = {};
        activity.$["android:importantForAutofill"] = "noExcludeDescendants";
        console.log(
          `[withAutofillFix] Patched android:importantForAutofill on ${name}`,
        );
      }
    });

    return mod;
  });
};

module.exports = withAutofillFix;
