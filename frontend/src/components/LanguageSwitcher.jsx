import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const langs = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமிழ்" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(i18n.language?.split("-")[0] || "en");

  useEffect(() => {
    const onChange = (lng) => setCurrent(lng.split("-")[0]);
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, [i18n]);

  const change = (code) => {
    i18n.changeLanguage(code); // trigger rerender via react-i18next
    localStorage.setItem("i18nextLng", code); // persist selection
  };

  return (
    <div className='inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm'>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          className={`px-2.5 py-1 text-sm rounded-lg transition
            ${
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
