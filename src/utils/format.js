// simplified formatting utilities; locale is fixed to en-LK
export function useLocaleFormat() {
  const locale = "en-LK";

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
