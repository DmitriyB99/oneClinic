import type dayjs from "dayjs";

export interface BookDatesModel {
  books: number;
  day: string;
  freeStatus?: boolean;
}

export interface CalendarProps {
  bookDates?: BookDatesModel[];
  className?: string;
  onChange: (date: dayjs.Dayjs) => void;
}
export const MonthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
export const DaysOfTheWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
