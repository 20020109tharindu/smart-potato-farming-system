// src/components/LanguageSwitcher.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமிழ்" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState((i18n.language || "en").split("-")[0]);

  useEffect(() => {
    const onChange = (lng) => setCurrent((lng || "en").split("-")[0]);
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, [i18n]);

  const setLang = (code) => {
    const base = code.split("-")[0];
    i18n.changeLanguage(base);
    // i18n.js listener will persist to localStorage and update <html lang=...>
  };

  return (
    <div className='inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm'>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type='button'
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 text-sm rounded-lg transition ${
            current === l.code ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
          aria-pressed={current === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
