/**
 * Expo config plugin: disables Android Autofill AND Credential Manager.
 *
 * Two separate Android systems cause the focus-cycling issue:
 * 1. Classic Autofill (API 26+): fixed by android:importantForAutofill on the Activity
 * 2. Credential Manager (API 33+): fixed by the meta-data opt-out key
 *
 * Both are required on API 36 (Android 16) where Credential Manager is aggressive.
 */
const { withAndroidManifest } = require("expo/config-plugins");

const withAutofillFix = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = manifest.manifest.application[0];

    // ── 1. Patch every <activity> with importantForAutofill ─────────────
    const activities = app.activity ?? [];
    console.log(
      "[withAutofillFix] Activities found:",
      activities.map((a) => a.$?.["android:name"] ?? "(unnamed)"),
    );

    activities.forEach((activity) => {
      if (!activity.$) activity.$ = {};
      activity.$["android:importantForAutofill"] = "noExcludeDescendants";
      console.log(
        "[withAutofillFix] Patched:",
        activity.$["android:name"] ?? "(unnamed)",
      );
    });

    // ── 2. Opt out of Credential Manager (API 33+) via meta-data ────────
    if (!app["meta-data"]) app["meta-data"] = [];
    const metaData = app["meta-data"];

    const alreadyHasOptOut = metaData.some(
      (m) =>
        m.$?.["android:name"] ===
        "android.credentials.DISABLE_ASSISTED_SIGN_IN",
    );
    if (!alreadyHasOptOut) {
      metaData.push({
        $: {
          "android:name": "android.credentials.DISABLE_ASSISTED_SIGN_IN",
          "android:value": "true",
        },
      });
      console.log(
        "[withAutofillFix] Added meta-data: DISABLE_ASSISTED_SIGN_IN",
      );
    }

    // ── 3. Also disable the credential autofill suggestion bar ───────────
    const alreadyHasBar = metaData.some(
      (m) =>
        m.$?.["android:name"] ===
        "android.credentials.DISABLE_CREDENTIAL_SELECTOR",
    );
    if (!alreadyHasBar) {
      metaData.push({
        $: {
          "android:name": "android.credentials.DISABLE_CREDENTIAL_SELECTOR",
          "android:value": "true",
        },
      });
      console.log(
        "[withAutofillFix] Added meta-data: DISABLE_CREDENTIAL_SELECTOR",
      );
    }

    return mod;
  });
};

module.exports = withAutofillFix;
