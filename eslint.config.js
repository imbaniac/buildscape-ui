import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["*.config.js", "*.config.ts", "scripts/**/*.js"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      // Import sorting rules
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js builtins
            ["^node:"],
            // External packages (npm/bun packages)
            ["^@?\\w"],
            // SvelteKit modules
            ["^\\$app", "^\\$env"],
            // Alias imports ($lib)
            ["^\\$lib"],
            // Parent imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Relative imports (same folder and subfolders)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_|\\$\\$Props|\\$\\$Events|\\$\\$Slots",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "svelte/no-at-html-tags": "off",
      "svelte/valid-compile": "warn",
      "svelte/no-unused-svelte-ignore": "warn",
      "svelte/require-each-key": "warn",
      "svelte/prefer-svelte-reactivity": "warn",
      "svelte/no-unused-props": "off",
      // Import sorting rules for Svelte files
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js builtins
            ["^node:"],
            // External packages (npm/bun packages)
            ["^@?\\w"],
            // Svelte imports
            ["^svelte"],
            // SvelteKit modules
            ["^\\$app", "^\\$env"],
            // Alias imports ($lib)
            ["^\\$lib"],
            // Parent imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Relative imports (same folder and subfolders)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: ["*.config.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Import sorting rules for JS files
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".svelte-kit/",
      "build/",
      "dist/",
      "static/",
      "public/",
      "vite.config.ts",
      "svelte.config.js",
      "*.config.js",
      "*.config.ts",
      ".commitlintrc.js",
      "eslint.config.js",
      "scripts/**/*.js",
    ],
  },
];
