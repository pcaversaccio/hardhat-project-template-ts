/* eslint-disable @typescript-eslint/no-require-imports */
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");
/* eslint-enable @typescript-eslint/no-require-imports */

/** @type {import('typescript-eslint').TSESLint.FlatConfig.ConfigArray} */
module.exports = tseslint.config(
  {
    files: ["**/*.{js,ts}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      eslintConfigPrettier,
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      "pnpm-lock.yaml",
      "lib/**",
      "cache/**",
      "cache_hardhat/**",
      "cache_hardhat-zk/**",
      "artifacts/**",
      "artifacts-zk/**",
      "typechain-types/**",
      "coverage/**",
      "deployments/**",
      "deployments-zk/**",
      "deployments_tenderly/**",
      "forge-artifacts/**",
      "bin/**",
      "out/**",
    ],
  },
);
