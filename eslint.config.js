import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "react-native": reactNativePlugin,
        },
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            "no-console": "warn", // Prevent console.logs in production
            "react/prop-types": "off", // Not needed with TypeScript
            "react-native/no-unused-styles": "error",
            "react-native/no-inline-styles": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
    prettierConfig, // Must be last to override styling rules
];