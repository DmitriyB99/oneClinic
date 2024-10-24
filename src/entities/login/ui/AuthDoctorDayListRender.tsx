import type { FC } from "react";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { AuthDoctorDayListRenderModel } from "@/entities/login";
import { TimePickerSaunet } from "@/shared/components";
import { timeFormat } from "@/shared/config";

export const AuthDoctorDayListRender: FC<AuthDoctorDayListRenderModel> = ({
  isChecked,
  startTime,
  endTime,
  setDaysList,
  id,
}) => {
  const t = useTranslations("Common");

  return isChecked ? (
    <div className="ml-12 flex w-3/4">
      <TimePickerSaunet
        className="mr-1 inline w-20"
        format={timeFormat}
        defaultValue={dayjs(startTime, timeFormat)}
        onChange={(time) => {
          setDaysList((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    startTime: dayjs(time).format(timeFormat),
                  }
                : {
                    ...item,
                  }
            )
          );
        }}
        placeholder={t("Start")}
      />
      <TimePickerSaunet
        className="mr-1 inline w-20"
        format={timeFormat}
        defaultValue={dayjs(endTime, timeFormat)}
        onChange={(time) => {
          setDaysList((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    endTime: dayjs(time).format(timeFormat),
                  }
                : {
                    ...item,
                  }
            )
          );
        }}
        placeholder={t("End")}
      />
    </div>
  ) : (
    <div />
  );
};
