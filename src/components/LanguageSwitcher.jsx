import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language || "en"}
      onChange={handleChange}
      className='bg-white border rounded px-3 py-1 text-sm'
      aria-label='Select language'
    >
      <option value='en'>English</option>
      <option value='si'>සිංහල</option>
      <option value='ta'>தமிழ்</option>
    </select>
  );
}
