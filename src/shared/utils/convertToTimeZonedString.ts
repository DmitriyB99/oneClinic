import dayjs from "dayjs";

import { getTimezoneOffsetString } from "@/shared/utils/getTimezoneOffsetString";

import { dateTimeWithOffset } from "../config";

export const convertToTimeZonedString = (date: Date) => {
  const timeZoneOffset = getTimezoneOffsetString(date);
  return `${date.toISOString().replaceAll("Z", "")}${timeZoneOffset}`;
};

export const convertToDateWithOffsetByTime = (
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0
) => {
  const dateTime = new Date();
  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);
  dateTime.setSeconds(seconds);
  dateTime.setMilliseconds(milliseconds);

  return dayjs(dateTime).format(dateTimeWithOffset);
};
