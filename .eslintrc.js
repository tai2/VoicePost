// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  ignorePatterns: ["/dist/*"],
  overrides: [
    {
      files: ["jest-setup.js"],
      env: {
        jest: true,
      },
    },
    {
      files: ["maestro/**/*.js"],
      globals: {
        maestro: "readonly",
        output: "readonly",
      },
    },
  ],
};
