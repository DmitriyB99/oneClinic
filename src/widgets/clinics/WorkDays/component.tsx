import type { FC } from "react";

import clsx from "clsx";

import type { WorkPeriod } from "@/shared/api/clinics";
import { DividerSaunet, Island } from "@/shared/components";

const weekDays = [
  {
    short: "Пн",
    code: "MONDAY",
  },
  {
    short: "Вт",
    code: "TUESDAY",
  },
  {
    short: "Ср",
    code: "WEDNESDAY",
  },
  {
    short: "Чт",
    code: "THURSDAY",
  },
  {
    short: "Пт",
    code: "FRIDAY",
  },
  {
    short: "Сб",
    code: "SATURDAY",
  },
  {
    short: "Вс",
    code: "SUNDAY",
  },
];

export const WorkDaysClinic: FC<{ workingDays: WorkPeriod[] }> = ({
  workingDays,
}) => (
  <Island className="mb-2">
    <p className="mb-3 text-Bold20">График работы</p>
    <div className="my-2 flex justify-between">
      {weekDays.map(({ code, short }) => {
        const workingDay = workingDays.find(
          ({ day_of_week }) => day_of_week === code
        );
        return (
          <div
            key={code}
            className={clsx(
              "flex h-[88px] w-[42px] flex-col items-center rounded-full p-1",
              {
                "bg-gray-1": !workingDay?.is_working,
                "!bg-brand-light": workingDay?.is_working,
              }
            )}
          >
            <div
              className={clsx(
                "mb-2 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gray-3 text-Semibold12",
                {
                  "bg-gray-3": !workingDay?.is_working,
                  "!bg-brand-primary": workingDay?.is_working,
                }
              )}
            >
              {short}
            </div>
            <div className="text-Regular10">
              {workingDay?.start_time ?? "-"}
            </div>
            <DividerSaunet className="m-0 my-0.5 h-1" type="vertical" />
            <div className="text-Regular10">{workingDay?.end_time ?? "-"}</div>
          </div>
        );
      })}
    </div>
  </Island>
);
