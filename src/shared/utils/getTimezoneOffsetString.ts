export const getTimezoneOffsetString = (date?: Date) => {
  if (!date) {
    return "";
  }
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
  const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes) % 60;
  const timezoneOffsetSign = timezoneOffsetMinutes > 0 ? "-" : "+";
  return `${timezoneOffsetSign}${timezoneOffsetHours
    .toString()
    .padStart(2, "0")}${timezoneOffsetMinutesRemainder
    .toString()
    .padStart(2, "0")}`;
};
