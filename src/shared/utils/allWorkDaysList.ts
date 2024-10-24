import dayjs from "dayjs";

import type { WorkTimeCheckModel } from "@/entities/desktopSetting";
import type { Weekday } from "@/entities/login";
import { WeekdayEnum } from "@/entities/login";
import { dateTimeWithOffset } from "@/shared/config";

import type { WorkPeriod } from "../api/clinics";

export const allDays = Object.keys(WeekdayEnum).map((day) => ({
  active: true,
  startWorkTime: dayjs().hour(8).minute(0).format(dateTimeWithOffset),
  finishWorkTime: dayjs().hour(18).minute(0).format(dateTimeWithOffset),
  day: day,
}));

export const getWorkDaysForm = (workDays: WorkTimeCheckModel[]) =>
  workDays
    .map((item) => {
      if (item.active) {
        return {
          day: WeekdayEnum[item.day as Weekday] as string,
          startTime: item.startWorkTime,
          endTime: item.finishWorkTime,
        };
      }
    })
    .filter(Boolean) as WorkPeriod[];
