export const timeFormat = "HH:mm";
export const dateFormat = "DD MMMM";
export const shortDayDateFormat = "D MMMM";
export const dateWithYearFormat = "DD MMMM YYYY";
export const dateTimeWithOffset = "YYYY-MM-DDTHH:mm:ss.SSSZZ";
export const dateTimeFormat = "HH:mm DD.MM";
export const dateTimeFormatWithMinutes = "DD MMMM, dd, HH:mm";
export const dateOfBirthFormat = "DD.MM.YYYY";
export const systemDateWithoutTime = "YYYY-MM-DD";

export const formatMoney = (amount: number | string): string =>
  amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
