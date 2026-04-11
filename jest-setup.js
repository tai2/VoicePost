import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja.json";

// To avoid font loading error in tests
// ref: github.com/callstack/react-native-paper/issues/4561#issuecomment-2500877723
jest.mock("expo-font");

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

i18n.use(initReactI18next).init({
  resources: {
    ja: {
      translation: ja,
    },
  },
  fallbackLng: "ja",
  lng: "ja  ",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});
