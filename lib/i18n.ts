import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "../locales/en.json";
import ja from "../locales/ja.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
  },
  fallbackLng: "en",
  lng: getLocales()[0].languageCode ?? undefined,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
