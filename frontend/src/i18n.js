import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// If you used the detector earlier, you can keep it, but this explicit 'lng' solves most issues.
import en from "./locales/en.json";
import si from "./locales/si.json";
import ta from "./locales/ta.json";

const savedLng = localStorage.getItem("i18nextLng") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  lng: savedLng, // <— force i18n to start with saved value
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  // debug: true, // uncomment to see logs in console
});

export default i18n;
