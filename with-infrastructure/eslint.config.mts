import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "@stylistic": stylistic,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      "@stylistic/indent": ["error", 2],
    },
  },
  ...tseslint.configs.recommended,
]);
