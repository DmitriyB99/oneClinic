import type { FC } from "react";
import { useMemo } from "react";

import clsx from "clsx";
import dayjs from "dayjs";

import type { DateFullCellRenderProps } from "../models/DateFullCellRenderCompProps";

export const DateFullCellRender: FC<DateFullCellRenderProps> = ({
  date,
  bookDates,
  selectedDate,
}) => {
  const calendarDay = useMemo(() => date.format("D"), [date]);

  const dateType = useMemo(() => {
    switch (date.format("DD.MM.YYYY")) {
      case dayjs(selectedDate).format("DD.MM.YYYY"):
        return "selected";
      case dayjs(new Date()).format("DD.MM.YYYY"):
        return "today";
      default:
        return "default";
    }
  }, [date, selectedDate]);

  const { freeStatus, bookCount } = useMemo(() => {
    const currentDay = bookDates?.find(
      (bookday) => date.format("MM D") === bookday.day
    );
    return {
      bookCount: currentDay?.books ?? 0,
      freeStatus: currentDay?.freeStatus ?? true, // добавил всегда тру, если надо-изменить
    };
  }, [date, bookDates]);

  return (
    <div
      className={clsx(
        "ml-2 flex h-9 w-9 flex-col items-center justify-center rounded-full text-Regular16",
        {
          "border-solid border-2 border-brand-primary": dateType === "today",
          "bg-brand-primary": dateType === "selected",
          "text-gray-8": !freeStatus,
        }
      )}
    >
      {calendarDay}
      {bookCount > 0 && (
        <div className="flex gap-0.5">
          <div
            className={clsx(
              "h-1 w-1 rounded-full border border-solid border-brand-primary",
              {
                "border-brand-secondary": dateType === "selected",
              }
            )}
          />
          {bookCount > 1 && (
            <div className="h-1 w-1 rounded-full border border-solid border-positiveStatus" />
          )}
          {bookCount > 2 && (
            <div className="h-1 w-1 rounded-full border border-solid border-positiveStatus" />
          )}
        </div>
      )}
    </div>
  );
};
