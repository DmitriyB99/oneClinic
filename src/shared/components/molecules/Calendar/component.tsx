import type { FC } from "react";
import { useState } from "react";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Calendar as CalendarAntd } from "antd";
import dayjs from "dayjs";

import { DateFullCellRender } from "./DateFullCellRender";
import type { CalendarProps } from "./props";
import { MonthNames } from "./props";

export const Calendar: FC<CalendarProps> = ({
  onChange,
  className,
  bookDates,
}) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs(new Date())
  );

  return (
    <CalendarAntd
      value={dayjs(selectedDate)}
      className={className}
      onChange={(date) => {
        setSelectedDate(date);
        onChange(date);
      }}
      headerRender={(config) => (
        <div className="flex items-center justify-between px-4 py-3">
          {/* Левая стрелка */}
          <div className="flex-1 text-left">
            <ArrowLeftOutlined
              className="cursor-pointer text-Bold20"
              onClick={() => {
                config.onChange(dayjs(selectedDate).subtract(1, "month"));
              }}
            />
          </div>

          <div className="flex-0 text-center">
            <div className="text-Bold20">
              {MonthNames[selectedDate.toDate().getMonth()]}
            </div>
            <div className="text-Regular14">{selectedDate.year()}</div>
          </div>

          <div className="flex-1 text-right">
            <ArrowRightOutlined
              className="cursor-pointer text-Bold20"
              onClick={() => {
                config.onChange(dayjs(selectedDate).add(1, "month"));
              }}
            />
          </div>
        </div>
      )}
      fullscreen={false}
      dateFullCellRender={(date) => (
        <DateFullCellRender
          date={date}
          bookDates={bookDates}
          selectedDate={selectedDate}
        />
      )}
    />
  );
};
