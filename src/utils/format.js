import { useTranslation } from "react-i18next";

export function useLocaleFormat() {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const locale = lang.startsWith("si")
    ? "si-LK"
    : lang.startsWith("ta")
    ? "ta-LK"
    : "en-LK";

  const currency = (num) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(Number(num || 0));

  const number = (num) =>
    new Intl.NumberFormat(locale).format(Number(num || 0));

  return { currency, number, locale };
}
