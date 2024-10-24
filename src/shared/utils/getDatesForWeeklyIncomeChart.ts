import dayjs from "dayjs";
import "dayjs/locale/en";
import weekday from "dayjs/plugin/weekday";

import { dateTimeWithOffset } from "../config";

dayjs.extend(weekday);

type Day =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
type RussianDay = "Вс" | "Пн" | "Вт" | "Ср" | "Чт" | "Пт" | "Сб";

export type SortedDays = Array<{
  date: string;
  day: Day;
  dayOnRussian: RussianDay;
}>;

export const getDatesForWeeklyIncomeChart = (): SortedDays => {
  const days: Day[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const daysOnRussian: Record<Day, RussianDay> = {
    sunday: "Вс",
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
  };
  const today = dayjs().day();
  const sortedDays = [...days.slice(today), ...days.slice(0, today)];

  return sortedDays.map((day: Day, index: number) => ({
    day,
    dayOnRussian: daysOnRussian[day],
    date: dayjs().subtract(index, "day").format(dateTimeWithOffset),
  }));
};
