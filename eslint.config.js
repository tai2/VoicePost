// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["jest-setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
  },
  {
    files: ["maestro/**/*.js"],
    languageOptions: {
      globals: {
        maestro: "readonly",
        output: "readonly",
      },
    },
  },
]);
