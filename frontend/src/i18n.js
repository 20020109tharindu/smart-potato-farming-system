// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import si from "./locales/si.json";
import ta from "./locales/ta.json";

const savedLng = (localStorage.getItem("i18nextLng") || "en").split("-")[0];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  lng: savedLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false }, // <-- important in Vite setups
});

// keep <html lang> + persist selected language
i18n.on("languageChanged", (lng) => {
  const code = (lng || "en").split("-")[0];
  document.documentElement.lang = code;
  localStorage.setItem("i18nextLng", code);
});

export default i18n;
