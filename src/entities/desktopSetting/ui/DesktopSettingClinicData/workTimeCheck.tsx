import type { FC } from "react";
import { useCallback } from "react";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import type { WorkTimeCheckProps } from "@/entities/desktopSetting";
import { Checkbox, DividerSaunet, TimePickerSaunet } from "@/shared/components";
import { dateTimeWithOffset, timeFormat } from "@/shared/config";

enum TimeType {
  finishWorkTime = "finishWorkTime",
  startWorkTime = "startWorkTime",
}

export const WorkTimeCheck: FC<WorkTimeCheckProps> = ({
  active,
  startWorkTime,
  finishWorkTime,
  setWorkDays,
  day,
}) => {
  const setActiveDay = useCallback(
    (event: CheckboxChangeEvent) =>
      setWorkDays?.((prevWorkDays) =>
        prevWorkDays.map((workDay) =>
          workDay.day === day
            ? { ...workDay, active: event.target.checked }
            : workDay
        )
      ),
    [setWorkDays, day]
  );
  const setWorkTime = useCallback(
    (time: Dayjs | null, timeType: TimeType) =>
      setWorkDays?.((prevWorkDays) =>
        prevWorkDays.map((workDay) =>
          workDay.day === day
            ? {
                ...workDay,
                [timeType]: dayjs(time).format(dateTimeWithOffset),
              }
            : workDay
        )
      ),
    [setWorkDays, day]
  );
  return (
    <div className="max-w-[500px]">
      <div className="mt-3 flex justify-between py-3">
        <Checkbox
          checked={active}
          onChange={setActiveDay}
          desktop
          className="mt-0.5 text-Regular16"
        >
          {day}
        </Checkbox>
        {active && (
          <div className="flex gap-3">
            <TimePickerSaunet
              format={timeFormat}
              defaultValue={dayjs(startWorkTime)}
              className="w-15"
              onChange={(time) => setWorkTime(time, TimeType.startWorkTime)}
            />
            <TimePickerSaunet
              format={timeFormat}
              className="w-15"
              defaultValue={dayjs(finishWorkTime)}
              onChange={(time) => setWorkTime(time, TimeType.finishWorkTime)}
            />
          </div>
        )}
      </div>
      <DividerSaunet className="mb-3 mt-0" />
    </div>
  );
};
