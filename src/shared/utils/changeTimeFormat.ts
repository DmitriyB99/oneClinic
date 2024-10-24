import dayjs from "dayjs";

import { getTimezoneOffsetString } from "./getTimezoneOffsetString";

export const changeTimeFormat = (date: Date, time: string) => {
  const [hours, minutes] = time?.split(":") ?? [];
  const zoneOffset = getTimezoneOffsetString(date);

  const endTime =
    time?.substring(3, 5) === "40"
      ? `${parseInt(hours) + 1}:00`
      : `${hours}:${parseInt(minutes) + 20}`;

  return [
    `${dayjs(date)?.format("YYYY-MM-DD")}T${time}:00.000${zoneOffset}`,
    `${dayjs(date)?.format("YYYY-MM-DD")}T${endTime}:00.000${zoneOffset}`,
  ];
};
